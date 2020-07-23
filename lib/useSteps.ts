import useSWR, { SWRConfig } from "swr";
import { useState } from "react";

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
  const initialStepsData: any[] = [];
  let { data: storedSteps, mutate } = useSWR<any[]>(
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
  const [lines, changeLines] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  /*
  Helper function to find the step with the associated stepId in `storedSteps`
  */
  function findIdx(stepId: any) {
    let idx = 0;
    let counter = 0;

    storedSteps!.forEach((element: { id: any; lines: any; text: any }) => {
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
      lines: null,
      order: storedSteps!.length,
    };

    let newStep = { id: stepId, lines: null, text: text };

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
  Updates a step in Firebase. Triggered from `EditingStoredStep.tsx`.
  */
  function updateStoredStep(stepId: any, text: any) {
    let data = {
      requestedAPI: "update_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
      lines: null,
    };

    let newStep = { id: stepId, lines: null, text: text };
    let optimisticSteps = storedSteps!.slice();
    let idx = findIdx(stepId);
    optimisticSteps[idx] = newStep;

    mutate(optimisticSteps, false);

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  function saveLines(stepId: string, text: any) {
    let data = {
      requestedAPI: "update_step",
      text: text,
      draftId: draftId,
      stepId: stepId,
      lines: lines,
    };

    // optimistic mutate
    let newStep = { id: stepId, lines: lines, text: text };
    let optimisticSteps = storedSteps!.slice();
    let idx = findIdx(stepId);
    optimisticSteps[idx] = newStep;
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

  return {
    saveStep,
    updateStoredStep,
    deleteStoredStep,
    moveStepUp,
    moveStepDown,
    realSteps: storedSteps,
    editingStep,
    changeEditingStep,
    lines,
    changeLines,
  };
}
