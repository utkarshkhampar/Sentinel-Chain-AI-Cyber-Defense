"""
Linux log normalizer — handles syslog-formatted lines shipped by
Filebeat/Fluent Bit from /var/log/syslog, /var/log/auth.log, and
/var/log/audit/audit.log (roadmap Chapter 7.2).

Expected raw_payload examples:
    "Aug  5 04:45:12 web-01 sshd[1234]: Failed password for root from 185.220.101.42 port 51000 ssh2"
    "Aug  5 04:47:01 db-02 sudo: analyst : TTY=pts/0 ; PWD=/home/analyst ; USER=root ; COMMAND=/bin/systemctl restart nginx"
"""
from __future__ import annotations

import logging
import re

from events import LogRawEvent
from app.collectors.base import BaseNormalizer

logger = logging.getLogger(__name__)

_SYSLOG_HEADER_RE = re.compile(
    r"^(?P<timestamp>\w{3}\s+\d+\s+\d{2}:\d{2}:\d{2})\s+"
    r"(?P<host>\S+)\s+"
    r"(?P<process>[\w.\-/]+)(\[(?P<pid>\d+)\])?:\s*"
    r"(?P<message>.*)$"
)
_FAILED_PASSWORD_RE = re.compile(r"Failed password for (invalid user )?(?P<user>\S+) from (?P<ip>\S+) port (?P<port>\d+)")
_ACCEPTED_RE = re.compile(r"Accepted \w+ for (?P<user>\S+) from (?P<ip>\S+) port (?P<port>\d+)")
_SUDO_RE = re.compile(r"(?P<user>\S+)\s*:\s*TTY=(?P<tty>\S+)\s*;\s*PWD=(?P<pwd>\S+)\s*;\s*USER=(?P<target_user>\S+)\s*;\s*COMMAND=(?P<command>.*)")


class LinuxLogNormalizer(BaseNormalizer):
    source_type = "linux"

    def normalize(self, raw_payload: str, source_asset_id: str | None) -> LogRawEvent:
        header = _SYSLOG_HEADER_RE.match(raw_payload.strip())
        if not header:
            logger.warning("Linux normalizer: unparseable syslog line, forwarding as raw event")
            return self._base_event(raw_payload, source_asset_id, "linux.unparsed", {})

        fields = header.groupdict()
        message = fields["message"]
        process = fields.get("process", "")

        if process == "sshd":
            failed = _FAILED_PASSWORD_RE.search(message)
            if failed:
                return self._base_event(raw_payload, source_asset_id, "linux.ssh_auth_failed", {
                    "host": fields["host"], "user": failed["user"], "source_ip": failed["ip"], "port": failed["port"],
                })
            accepted = _ACCEPTED_RE.search(message)
            if accepted:
                return self._base_event(raw_payload, source_asset_id, "linux.ssh_auth_success", {
                    "host": fields["host"], "user": accepted["user"], "source_ip": accepted["ip"], "port": accepted["port"],
                })
            return self._base_event(raw_payload, source_asset_id, "linux.ssh_other", {"host": fields["host"], "message": message})

        if process == "sudo":
            sudo_match = _SUDO_RE.search(message)
            if sudo_match:
                return self._base_event(raw_payload, source_asset_id, "linux.privilege_escalation", {
                    "host": fields["host"], **sudo_match.groupdict(),
                })

        return self._base_event(raw_payload, source_asset_id, "linux.generic", {
            "host": fields["host"], "process": process, "message": message,
        })
