const postReducer = (
  state = { posts: [], loading: false, error: false, imgError: false, uploading: false },
  action
) => {
  switch (action.type) {
    // belongs to PostShare.jsx
    case "IMG_UPLOAD_START":
      return { ...state, imgError: false, uploading: true };
    case "IMG_UPLOAD_SUCCESS":
      return { ...state, uploading: false, imgError: false };
    case "IMG_UPLOAD_FAIL":
      return { ...state, uploading: false, imgError: true };
    case "UPLOAD_START":
      return { ...state, error: false, uploading: true };
    case "UPLOAD_SUCCESS":
      return { ...state, posts: [action.data, ...state.posts], uploading: false, error: false };
    case "UPLOAD_FAIL":
      return { ...state, uploading: false, error: true };
    // belongs to Posts.jsx
    case "RETREIVING_START":
      return { ...state, loading: true, error: false };
    case "RETREIVING_SUCCESS":
      return { ...state, posts: action.data, loading: false, error: false };
    case "RETREIVING_FAIL":
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

export default postReducer;
