from app.collectors.linux import LinuxLogNormalizer
from app.collectors.application import ApplicationLogNormalizer
from app.collectors.registry import get_normalizer, SUPPORTED_SOURCE_TYPES


class TestLinuxNormalizer:
    def setup_method(self):
        self.normalizer = LinuxLogNormalizer()

    def test_failed_ssh_login_is_recognized(self):
        line = "Aug  5 04:45:12 web-01 sshd[1234]: Failed password for root from 185.220.101.42 port 51000 ssh2"
        event = self.normalizer.normalize(line, source_asset_id="web-01")
        assert event.log_event_type == "linux.ssh_auth_failed"
        assert event.parsed_fields["source_ip"] == "185.220.101.42"
        assert event.parsed_fields["user"] == "root"

    def test_successful_ssh_login_is_recognized(self):
        line = "Aug  5 04:50:00 web-01 sshd[1234]: Accepted publickey for deploy from 10.0.0.5 port 51000 ssh2"
        event = self.normalizer.normalize(line, source_asset_id="web-01")
        assert event.log_event_type == "linux.ssh_auth_success"
        assert event.parsed_fields["user"] == "deploy"

    def test_sudo_privilege_escalation_is_recognized(self):
        line = "Aug  5 04:47:01 db-02 sudo: analyst : TTY=pts/0 ; PWD=/home/analyst ; USER=root ; COMMAND=/bin/systemctl restart nginx"
        event = self.normalizer.normalize(line, source_asset_id="db-02")
        assert event.log_event_type == "linux.privilege_escalation"
        assert event.parsed_fields["target_user"] == "root"
        assert "systemctl" in event.parsed_fields["command"]

    def test_unparseable_line_does_not_raise(self):
        event = self.normalizer.normalize("garbage not a syslog line at all", source_asset_id=None)
        assert event.log_event_type == "linux.unparsed"
        assert event.raw_payload == "garbage not a syslog line at all"


class TestApplicationNormalizer:
    def setup_method(self):
        self.normalizer = ApplicationLogNormalizer()

    def test_structured_json_is_parsed(self):
        payload = '{"level":"error","service":"incident-service","message":"DB timeout","user_id":"abc-123"}'
        event = self.normalizer.normalize(payload, source_asset_id="incident-service-pod-1")
        assert event.log_event_type == "application.error"
        assert event.parsed_fields["service"] == "incident-service"
        assert event.parsed_fields["user_id"] == "abc-123"

    def test_invalid_json_does_not_raise(self):
        event = self.normalizer.normalize("not json at all", source_asset_id=None)
        assert event.log_event_type == "application.unparsed"


class TestRegistry:
    def test_all_supported_types_resolve(self):
        for source_type in SUPPORTED_SOURCE_TYPES:
            assert get_normalizer(source_type) is not None

    def test_unknown_type_raises_keyerror(self):
        import pytest

        with pytest.raises(KeyError):
            get_normalizer("carrier_pigeon")
