import useSWR, { SWRConfig } from "swr";
import { useState } from "react";

type Line = {
  lineNumber: number;
  char: number;
};

type Step = {
  id: string;
  lines?: { start: number; end: number };
  text: any;
  fileId?: string;
  image?: string;
};

export function useSteps(draftId: string, authenticated: boolean) {
  const myRequest = (requestedAPI: string) => {
    return {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: requestedAPI,
        draftId,
      }),
    };
  };

  const stepsFetcher = () =>
    fetch("../api/endpoint", myRequest("getDraftSteps")).then((res: any) =>
      res.json()
    );

  // Fetch steps data
  const initialStepsData: Step[] = [];
  let { data: storedSteps, mutate } = useSWR<Step[]>(
    authenticated ? "getSteps" : null,
    stepsFetcher,
    {
      initialData: initialStepsData,
      revalidateOnMount: true,
    }
  );

  // What step is currently being edited?
  const [editingStep, changeEditingStep] = useState(-1);

  // What lines are currently highlighted?
  const [lines, changeLines] = useState<{ start: Line; end: Line }>({
    start: { lineNumber: 0, char: 0 },
    end: { lineNumber: 0, char: 0 },
  });

  /*
  Helper function to find the step with the associated stepId in `storedSteps`
  */
  function findIdx(stepId: string): number {
    let idx = 0;
    let counter = 0;

    storedSteps!.forEach((element: Step) => {
      if (element["id"] == stepId) {
        idx = counter;
      }
      counter += 1;
    });
    return idx;
  }

  /*
  Saves a step into Firebase. Triggered from `Step.tsx`.
  */
  function saveStep(stepId: string, text: string) {
    var data = {
      requestedAPI: "save_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
      lines: undefined,
      order: storedSteps!.length,
    };

    let newStep = { id: stepId, lines: undefined, text: text };

    let optimisticSteps = [...storedSteps!];
    optimisticSteps.push(newStep);

    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let resJSON = await res.json();
      mutate(resJSON);
    });
  }

  /*
  mutates content inside a desired step. Does not save text to backend.
  */
  function mutateStoredStep(stepId: any, text: any) {
    let optimisticSteps = storedSteps!.slice();
    let idx = findIdx(stepId);

    optimisticSteps[idx] = {
      ...optimisticSteps[idx],
      text,
    };

    mutate(optimisticSteps, false);
  }

  /*
  Updates a step in Firebase. Triggered from `StoredStep.tsx`.
  */
  async function saveStepToBackend(stepId: string, text: string) {
    let data = {
      requestedAPI: "update_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
    };
    let idx = findIdx(stepId);
    let optimisticSteps = storedSteps!.slice();
    optimisticSteps[idx] = {
      ...optimisticSteps[idx],
      text,
    };

    mutate(optimisticSteps, false);

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      // let resJSON = await res.json();
      // mutate(resJSON, false);
    });
  }

  function removeLines(stepIndex: number) {
    let stepId = storedSteps![stepIndex].id;
    // optimistic mutate
    let optimisticSteps = storedSteps!.slice();
    let idx = findIdx(stepId);

    let data = {
      requestedAPI: "updateStepLines",
      draftId: draftId,
      stepId: stepId,
      lines: undefined,
      fileId: undefined,
    };

    optimisticSteps[idx] = {
      ...optimisticSteps[idx],
      lines: undefined,
      fileId: undefined,
    };

    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedSteps = await res.json();
      mutate(updatedSteps, true);
    });
  }

  /* 
  Attach lines selected in the code editor to the current editing step.
  if remove is true, fileName and lines are cleared from the step
  if renameFile is true, only the fileName is updated (lines are untouched)
  */
  function saveLines(fileId: string, remove: boolean) {
    let stepId = storedSteps![editingStep].id;
    let linesData = {
      start: lines.start.lineNumber,
      end: lines.end.lineNumber,
    };

    // optimistic mutate
    let optimisticSteps = storedSteps!.slice();
    let idx = findIdx(stepId);
    let data;
    if (remove) {
      data = {
        requestedAPI: "updateStepLines",
        draftId: draftId,
        stepId: stepId,
        lines: undefined,
        fileId: undefined,
      };
      optimisticSteps[idx] = {
        ...optimisticSteps[idx],
        fileId: undefined,
        lines: undefined,
      };
    } else {
      data = {
        requestedAPI: "updateStepLines",
        draftId: draftId,
        stepId: stepId,
        lines: linesData,
        fileId: fileId,
      };
      optimisticSteps[idx] = {
        ...optimisticSteps[idx],
        lines: linesData,
        fileId: fileId,
      };
    }
    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedSteps = await res.json();
      mutate(updatedSteps, false);
    });
  }

  function renameStepFileName(stepIndex: number, newFileId: string) {
    let stepId = storedSteps![stepIndex].id;

    // optimistic mutate
    let optimisticSteps = storedSteps!.slice();

    let data = {
      requestedAPI: "renameStepFileName",
      draftId: draftId,
      stepId: stepId,
      newFileName: newFileId,
    };

    optimisticSteps[stepIndex] = {
      ...optimisticSteps[stepIndex],
      fileId: newFileId,
    };
    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedSteps = await res.json();
      mutate(updatedSteps, false);
    });
  }

  /*
  Deletes a step from Firebase. Triggered from `StoredStep.tsx`.
  */
  function deleteStoredStep(stepId: any) {
    let optimisticSteps = storedSteps!.slice();
    let idx = findIdx(stepId);
    let stepsToChange = optimisticSteps.slice(idx + 1, optimisticSteps.length);
    optimisticSteps.splice(idx, 1);

    mutate(optimisticSteps, false);

    let data = {
      requestedAPI: "delete_step",
      draftId: draftId,
      stepId: stepId,
      stepsToChange: stepsToChange,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  /*
  Moves a step up by changing its order in Firebase & in `optimisticSteps`. 
  Triggered from `RenderedStoredStep.tsx`.
  */
  function moveStepUp(stepId: any) {
    let idx = findIdx(stepId);
    if (idx == 0) {
      return;
    }

    let optimisticSteps = storedSteps!.slice();

    let data = {
      requestedAPI: "change_step_order",
      draftId: draftId,
      stepId: stepId,
      neighborId: optimisticSteps[idx - 1]["id"],
      oldIdx: idx,
      newIdx: idx - 1,
    };

    [optimisticSteps[idx], optimisticSteps[idx - 1]] = [
      optimisticSteps[idx - 1],
      optimisticSteps[idx],
    ];

    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  /*
  Moves a step down by changing its order in Firebase & in `optimisticSteps`. 
  Triggered from `RenderedStoredStep.tsx`.
  */
  function moveStepDown(stepId: any) {
    let idx = findIdx(stepId);
    if (idx == storedSteps!.length - 1) {
      return;
    }
    let optimisticSteps = storedSteps!.slice();

    let data = {
      requestedAPI: "change_step_order",
      draftId: draftId,
      stepId: stepId,
      neighborId: optimisticSteps[idx + 1]["id"],
      oldIdx: idx,
      newIdx: idx + 1,
    };

    [optimisticSteps[idx], optimisticSteps[idx + 1]] = [
      optimisticSteps[idx + 1],
      optimisticSteps[idx],
    ];

    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  async function addStepImage(selectedImage: any, draftId: any, stepId: any) {
      const toBase64 = (file: any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    let data = {
        requestedAPI: "saveImage",
        draftId: draftId,
        stepId: stepId,
        imageFile: await toBase64(selectedImage),
    };


    await fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
        }).then(async (res: any) => {
          let resJSON = await res.json();
          let url = resJSON.url;
          
          //optimistic mutate
          let optimisticSteps = storedSteps!.slice();
          optimisticSteps[editingStep].image = url;
          mutate(optimisticSteps, false);
        }).catch((error: any) => {
          console.log(error);
          console.log("upload failed");
        });
  }

  async function deleteStepImage(draftId: any, stepId: any) {
    let data = {
      requestedAPI: "deleteImage",
      draftId: draftId,
      stepId: stepId,
    };

    //optimistic mutate
    let optimisticSteps = storedSteps!.slice();
    optimisticSteps[editingStep].image = undefined;
    mutate(optimisticSteps, false);

    await fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
        }).then(async (res: any) => {
    });
  }

  return {
    saveStep,
    mutateStoredStep,
    saveStepToBackend,
    deleteStoredStep,
    moveStepUp,
    moveStepDown,
    realSteps: storedSteps,
    editingStep,
    changeEditingStep,
    lines,
    changeLines,
    saveLines,
    removeLines,
    renameStepFileName,
    addStepImage,
    deleteStepImage,
  };
}
