import { contentBlock } from "../../typescript/types/frontend/postTypes";

export function PublishedImageSection(props: {
  contentBlocks: contentBlock[];
}) {
  const { contentBlocks } = props;
  return (
    <div>
      {contentBlocks.map((contentBlock) => {})}

      <div>
          
      </div>
    </div>
  );
}

function ImageStep(props: { imageStep: contentBlock }) {}
