export const isComplete = (issue) => issue.status.category === "done";
export const isSubtask = (issue) => issue.subtask;
export const isEpic = (issue) => issue.type === "epic";

export const not = (func) => (_) => !func(_);
