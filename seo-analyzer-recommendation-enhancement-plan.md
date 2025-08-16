### **SEO Analyzer Recommendation Engine: Enhancement Plan**

**1. Objective**

To transform the current SEO report page from a static data display into a dynamic, actionable tool. This will be achieved by replacing the existing simple list of recommendations with a sophisticated system that generates tailored advice based on the specific results of the SEO analysis.

**2. Proposed Architecture**

The new system will be modular and scalable, built with new components, dedicated logic for recommendation generation, and clear type definitions.

*   **New Type Definitions (`app/types/seo-recommendations.ts`):**
    A new file will be created to define the structure of a recommendation object, ensuring consistency and type safety.

    ```typescript
    export type RecommendationSeverity = 'High' | 'Medium' | 'Low';

    export interface SEORecommendation {
      id: string;
      severity: RecommendationSeverity;
      title: string;
      description: string;
      action: string;
      relatedMetric?: string; // e.g., 'titleLength', 'lcp', 'https'
    }
    ```

*   **New Recommendation Generation Logic (`app/utils/generate-seo-recommendations.ts`):**
    A dedicated utility file will house the core logic for generating recommendations. This function will accept the `EnhancedSEOReport` object and return an array of `SEORecommendation` objects.

*   **New UI Components:**
    *   `app/components/seo-analyzer/RecommendationCard.tsx`: A reusable component to display a single recommendation with its severity, title, description, and proposed action.
    *   `app/components/seo-analyzer/RecommendationsSection.tsx`: A container component that will fetch and display the list of `RecommendationCard` components. It will also include UI elements for filtering by severity.

**3. Implementation Steps**

1.  **Create Type Definitions:**
    *   Create the `app/types/seo-recommendations.ts` file and add the `RecommendationSeverity` and `SEORecommendation` types as defined above.

2.  **Implement Recommendation Logic:**
    *   Create the `app/utils/generate-seo-recommendations.ts` file.
    *   Implement a function `generateSeoRecommendations(report: EnhancedSEOReport): SEORecommendation[]`.
    *   This function will contain a series of checks against the report's data points. For each potential issue, it will push a corresponding `SEORecommendation` object to an array.

    **Example Logic Snippets:**
    ```javascript
    // In generate-seo-recommendations.ts
    if (report.titleLength < 30 || report.titleLength > 65) {
      recommendations.push({
        id: 'title-length',
        severity: 'High',
        title: 'Optimize Title Tag Length',
        description: `Your title tag is ${report.titleLength} characters long. The optimal length is between 30 and 65 characters.`,
        action: 'Edit your title tag to be more concise or more descriptive to fit within the recommended range.',
        relatedMetric: 'titleLength'
      });
    }

    if (report.images.withoutAlt > 0) {
      recommendations.push({
        id: 'image-alt-text',
        severity: 'Medium',
        title: 'Add Missing Alt Text to Images',
        description: `You have ${report.images.withoutAlt} image(s) without alternative text. Alt text is crucial for accessibility and image SEO.`,
        action: 'Review your images and add descriptive alt text to all of them.',
        relatedMetric: 'images.withoutAlt'
      });
    }
    // ... more checks for all relevant metrics
    ```

3.  **Build UI Components:**
    *   Create `app/components/seo-analyzer/RecommendationCard.tsx`. This component will take a `recommendation: SEORecommendation` prop and render it in a clear, visually appealing card format. It should use color-coding for severity levels.
    *   Create `app/components/seo-analyzer/RecommendationsSection.tsx`. This component will:
        *   Accept the `report` as a prop.
        *   Call `generateSeoRecommendations(report)` to get the list of recommendations.
        *   Include state for filtering recommendations by severity.
        *   Render the list of `RecommendationCard` components.

4.  **Integrate into the Report Page:**
    *   Open `app/seo-analyzer/report/page.tsx`.
    *   Import the new `RecommendationsSection` component.
    *   Remove the existing `<ul>` that iterates over `report.recommendations`.
    *   In its place, add `<RecommendationsSection report={report} />`.

**4. Benefits of the New System**

*   **Actionable Insights:** Users will receive specific, data-driven advice they can act upon immediately.
*   **Prioritization:** Severity levels will help users focus on the most critical issues first.
*   **Improved User Experience:** The report will be more interactive and valuable, moving beyond a simple data dump.
*   **Scalability:** The modular architecture will make it easy to add new recommendation types as the SEO analyzer's capabilities expand.
*   **Maintainability:** Separating logic from presentation will make the codebase cleaner and easier to manage.
