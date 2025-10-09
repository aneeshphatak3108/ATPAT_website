class Flags:
    def __init__(self, test_id, student_id, flag_type, timestamp, details, to_review):
        self.test_id = test_id
        self.student_id = student_id
        self.flag_type = flag_type
        self.timestamp = timestamp
        self.details = details
        self.to_review = to_review