import * as yup from 'yup';
import onChange from 'on-change';
import renderModel from './render.js';

export default () => {
  const initModel = () => {
    const state = {
      urlInput: {
        isValid: true,
        errorText: '',
      },
      activeRssList: [],
    };

    const urlInputElement = document.querySelector('#url-input');
    const formElement = document.querySelector('form');

    const elements = { urlInputElement, formElement };

    return {
      elements, state,
    };
  };

  const { elements, state } = initModel();

  onChange({ elements, state }, renderModel);

  const urlSchema = yup.string().url().required();

  elements.formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.form.elements;
    urlSchema.validate(value)
      .then((url) => {
        state.activeRssList = [...state.activeRssList, url];
      })
      .catch((error) => {
        state.urlInput.isValid = false;
        state.urlInput.errorText = error.message;
      });
    console.log(state);
  });
};