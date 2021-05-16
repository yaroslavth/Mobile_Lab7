export const ADD_ITEMS = 'ADD_ITEMS';
export const ADD_INFO_ITEMS = 'ADD_INFO_ITEMS';
export const ADD_IMAGE_ITEMS = 'ADD_IMAGE_ITEMS';

export const AddItem = book => dispatch => {
    dispatch({
        type: ADD_ITEMS,
        payload: book
    });
};

export const AddInfoItem = info => dispatch => {
    dispatch({
        type: ADD_INFO_ITEMS,
        payload: info
    });
};

export const AddImageItem = img => dispatch => {
    dispatch({
        type: ADD_IMAGE_ITEMS,
        payload: img
    });
};
