import { FrontendSectionType } from "../typescript/enums/frontend/postEnums";
import {
  CodeSection,
  contentBlock,
  contentSection,
  fileObject,
  Lines,
  TextSection as TextSectionType,
} from "../typescript/types/frontend/postTypes";
import { Dispatch, SetStateAction } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { DraftHeader } from "./Headers";
import MarkdownSection from "./MarkdownSection";
import CodeStepSection from "./CodeStepSection";
import { opacityFade } from "../styles/framer_animations/opacityFade";
import { motion, AnimatePresence } from "framer-motion";
import { DraftContext } from "../contexts/draft-context";
import TextSection from "./TextSection";
import publishingStyles from "../styles/publishing.module.scss";
import appStyles from "../styles/app.module.scss";
import { FormattingToolbar } from "./FormattingToolbar";
type DraftContentProps = {
  draftContent: contentBlock[];
  draftTitle: string;
  onTitleChange: (updatedtitle: string) => Promise<void>;
  updateShowTags: any;
};

const PublishingHeader = (props: {
  draftTitle: string;
  onTitleChange: (updatedtitle: string) => Promise<void>;
}) => {
  let { draftTitle, onTitleChange } = props;
  return (
    <div className={publishingStyles["publishing-header"]}>
      <TitleLabel />
      <TextareaAutosize
        placeholder={draftTitle}
        value={draftTitle}
        onChange={async (e: React.FormEvent<HTMLTextAreaElement>) => {
          let myTarget = e.target as HTMLTextAreaElement;
          await onTitleChange(myTarget.value);
        }}
        style={{
          fontWeight: "bold",
          fontSize: "40px",
          color: "D0D0D0",
          fontFamily: "sans-serif",
        }}
        name="title"
      />
    </div>
  );
};

export function DraftContent(props: DraftContentProps) {
  const { draftContent, draftTitle, onTitleChange, updateShowTags } = props;
  return (
    <DraftContext.Consumer>
      {({ previewMode }) => (
        <AnimatePresence>
          {!previewMode && (
            <motion.div
              initial={"hidden"}
              animate={"visible"}
              exit={"hidden"}
              variants={opacityFade}
            >
              <DraftComponent
                draftContent={draftContent}
                draftTitle={draftTitle}
                onTitleChange={onTitleChange}
                updateShowTags={updateShowTags}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </DraftContext.Consumer>
  );
}

const DraftComponent = (props: DraftContentProps) => {
  let { updateShowTags, draftContent, onTitleChange, draftTitle } = props;

  const arrangedContent = arrangeContentList(draftContent);

  return (
    <div>
      <DraftHeader updateShowTags={updateShowTags} />
      <div className={appStyles["App"]}>
        <div className={appStyles["center-divs"]}>
          <PublishingHeader
            draftTitle={draftTitle}
            onTitleChange={onTitleChange}
          />
          <div className={appStyles["draft-content"]}>
            {arrangedContent.map((contentElement, index: number) => {
              switch (contentElement.type) {
                case FrontendSectionType.TextSection: {
                  contentElement.type;
                  const slateContent = (contentElement as contentSection &
                    TextSectionType).slateSection.slateContent;
                  const backendId = (contentElement as contentSection &
                    TextSectionType).slateSection.backendId;

                  return (
                    <TextSection
                      slateContent={slateContent}
                      key={backendId}
                      backendId={backendId}
                      sectionIndex={index}
                    />
                  );
                }
                case FrontendSectionType.CodeSection: {
                  const codeSteps = (contentElement as contentSection &
                    CodeSection).codeSteps;
                  return (
                    <CodeStepSection
                      codeSteps={codeSteps}
                      key={codeSteps[0].backendId}
                      sectionIndex={index}
                    />
                  );
                }
                default:
                  return "test";
              }
            })}
          </div>
        </div>
      </div>
      <FormattingToolbar />
    </div>
  );
};

function arrangeContentList(draftContent: contentBlock[]): contentSection[] {
  // iterate through array

  // if code step type
  // add to sub array

  // if not code step type, break sub array
  let finalArray: contentSection[] = [];
  let subArray: contentBlock[] = [];
  for (let i = 0; i < draftContent.length; i++) {
    if (draftContent[i].type === "codestep") {
      subArray.push(draftContent[i]);
    } else {
      if (subArray.length > 0) {
        finalArray.push({
          type: FrontendSectionType.CodeSection,
          codeSteps: subArray,
        });
      }
      subArray = [];
      finalArray.push({
        type: FrontendSectionType.TextSection,
        slateSection: draftContent[i],
      });
    }
  }
  if (subArray.length > 0) {
    finalArray.push({
      type: FrontendSectionType.CodeSection,
      codeSteps: subArray,
    });
  }
  // console.log("final array is");
  // console.log(finalArray);
  return finalArray;
}

const TitleLabel = () => {
  return <label className={publishingStyles["title-label"]}>Title</label>;
};
