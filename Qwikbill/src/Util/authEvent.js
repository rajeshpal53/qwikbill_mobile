let onUnauthorizedCallback = null;

export const setUnauthorizedHandler = (callback) => {
  onUnauthorizedCallback = callback;
};

export const triggerUnauthorized = () => {
  if (onUnauthorizedCallback) {
    onUnauthorizedCallback();
  }
};
