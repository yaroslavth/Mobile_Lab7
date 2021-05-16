import {
    ADD_IMAGE_ITEMS,
    ADD_INFO_ITEMS,
    ADD_ITEMS
} from './actions';

const initialState = {
    bookItems: [],
    infoItems: [],
    imageItems: [],
};

function booksReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_ITEMS:
            return {
                ...state,
                bookItems: action.payload
            };
        case ADD_INFO_ITEMS:
            return {
                ...state,
                infoItems: action.payload,
            };
        case ADD_IMAGE_ITEMS:
            return {
                ...state,
                imageItems: action.payload,
            };
        default:
            return state;
    }
}

export default booksReducer
