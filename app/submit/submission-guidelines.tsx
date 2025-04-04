import { Card, CardContent } from "@/components/ui/card"

export function SubmissionGuidelines() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Submission Guidelines</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Please review these guidelines before submitting your abstract or paper.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Abstract Guidelines</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Abstract should be 200 to 300 words</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Clearly state the research question, methodology, and key findings</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Include 3-5 keywords</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Submission deadline: March 21, 2025</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Full Paper Guidelines</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Full paper should be 4000 to 6000 words</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Follow APA reference style</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Languages: English or Malayalam</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Font style: English - Times New Roman (12 pt), Malayalam - ML-TTKarthika (14 pt)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Submission deadline: April 08, 2025</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Important Dates</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Abstract Submission Deadline: March 21, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Abstract Acceptance: February 1, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Abstract Acceptance Notification: March 24, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Full Paper Submission Deadline: April 08, 2025</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Date of the Seminar: April 10, 2025</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

