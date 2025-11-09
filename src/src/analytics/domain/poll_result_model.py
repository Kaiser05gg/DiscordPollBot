class PollResult:
    def __init__(self, question, results, voted_at):
        self.question = question
        self.results = results
        self.voted_at = voted_at

    def aggregate(self, other):
        """別のPollResultを合算"""
        for key, val in other.results.items():
            self.results[key] = self.results.get(key, 0) + val