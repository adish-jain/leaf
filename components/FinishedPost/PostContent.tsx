import { useContext } from "react";
import { ContentContext } from "../../contexts/finishedpost/content-context";
import {
  contentBlock,
  contentSection,
  ImageSection,
} from "../../typescript/types/frontend/postTypes";
import { FrontendSectionType } from "../../typescript/enums/frontend/postEnums";
import {
  CodeSection,
  TextSection as TextSectionType,
} from "../../typescript/types/frontend/postTypes";
import PublishedTextSection from "./../PublishedTextSection";
import { arrangeContentList } from "../../lib/usePosts";
import BlockSection from "./BlockSection";

export function PostContent(props: { scrollSpeed: number }) {
  const { scrollSpeed } = props;
  const { postContent } = useContext(ContentContext);
  const arrangedPostContent = arrangeContentList(postContent);

  return (
    <div
    // style={{ width: "800px", margin: "auto"
    // }
    // }
    >
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
            const contentBlocks = (contentElement as contentSection &
              CodeSection).contentBlocks;
            const startIndex = contentElement.startIndex;
            return (
              <BlockSection
                scrollSpeed={scrollSpeed}
                contentBlocks={contentBlocks}
                key={contentBlocks[0].backendId}
                startIndex={startIndex}
              />
            );
          }
          case FrontendSectionType.ImageSection: {
            const contentBlocks = (contentElement as contentSection &
              ImageSection).contentBlocks;
            const startIndex = contentElement.startIndex;
            return (
              <BlockSection
                scrollSpeed={scrollSpeed}
                contentBlocks={contentBlocks}
                key={contentBlocks[0].backendId}
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
