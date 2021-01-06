import { useContext } from "react";
import { ContentContext } from "../../contexts/finishedpost/content-context";
import {
  contentBlock,
  contentSection,
  serializedContentBlock,
} from "../../typescript/types/frontend/postTypes";
import { FrontendSectionType } from "../../typescript/enums/frontend/postEnums";
import {
  CodeSection,
  TextSection as TextSectionType,
} from "../../typescript/types/frontend/postTypes";
import PublishedTextSection from "./../PublishedTextSection";
import PublishedCodeStepSection from "../PublishedCodeSection";

export function PostContent(props: { scrollSpeed: number }) {
  const { scrollSpeed } = props;
  const { postContent } = useContext(ContentContext);
  const arrangedPostContent = arrangeContentList(postContent);

  return (
    <div>
      {arrangedPostContent.map((contentElement, index: number) => {
        switch (contentElement.type) {
          case FrontendSectionType.TextSection: {
            contentElement.type;
            const slateContent = (contentElement as contentSection &
              TextSectionType).slateSection.slateContent;
            const backendId = (contentElement as contentSection &
              TextSectionType).slateSection.backendId;
            const startIndex = contentElement.startIndex;
            return (
              <PublishedTextSection
                slateContent={slateContent}
                key={backendId}
                backendId={backendId}
                startIndex={startIndex}
              />
            );
          }
          case FrontendSectionType.CodeSection: {
            const codeSteps = (contentElement as contentSection & CodeSection)
              .codeSteps;
            const startIndex = contentElement.startIndex;
            return (
              <PublishedCodeStepSection
                scrollSpeed={scrollSpeed}
                codeSteps={codeSteps}
                key={codeSteps[0].backendId}
                startIndex={startIndex}
              />
            );
          }

          default:
            return "test";
        }
      })}
    </div>
  );
}

function arrangeContentList(
  draftContent: serializedContentBlock[]
): contentSection[] {
  // iterate through array

  // if code step type
  // add to sub array

  // if not code step type, break sub array
  let finalArray: serializedContentBlock[] = [];
  let subArray: serializedContentBlock[] = [];
  let runningSum = 0;
  for (let i = 0; i < draftContent.length; i++) {
    if (draftContent[i].type === "codestep") {
      // aggregate codesteps into subArray
      subArray.push(draftContent[i]);
      // runningSum += 1;
    } else {
      if (subArray.length > 0) {
        finalArray.push({
          type: FrontendSectionType.CodeSection,
          codeSteps: subArray,
          startIndex: runningSum,
        });
        runningSum += subArray.length;
      }
      subArray = [];
      finalArray.push({
        type: FrontendSectionType.TextSection,
        slateSection: draftContent[i],
        startIndex: runningSum,
      });
      runningSum += 1;
    }
  }
  if (subArray.length > 0) {
    finalArray.push({
      type: FrontendSectionType.CodeSection,
      codeSteps: subArray,
      startIndex: runningSum,
    });
  }
  return finalArray;
}
