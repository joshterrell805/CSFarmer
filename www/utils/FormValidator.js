function FormValidator({validationFn, errorMessageFn, defaults}) {
  if (!validationFn) throw Error(`validationFn required`);
  if (!errorMessageFn) throw Error(`errorMessageFn required`);

  const [errorReasonById, setErrorReasonById] = useState({});
  const [lastValueById, setLastValueById] = useState(defaults || {});

  function possiblyUnmarkRequired(id, newValue) {
    if (errorReasonById[id] == 'required' && !G.isWhitespace(newValue)) {
      setErrorReasonById({
        ...errorReasonById,
        [id]: undefined,
      })
    }
  }

  this.onTextChangeEvent = function onTextChangeEvent(event) {
    const {id, value} = event.target;
    setLastValueById({
      ...lastValueById,
      [id]: value
    })
    possiblyUnmarkRequired(id, value);
  };

  this.onRadioChange = function onRadioChange(radioId, selectedId) {
    setLastValueById({
      ...lastValueById,
      [radioId]: selectedId
    })
    possiblyUnmarkRequired(radioId, selectedId);
  };

  this.onCheckChange = function onCheckChange(id, checked) {
    setLastValueById({
      ...lastValueById,
      [id]: checked ? 'checked' : undefined,
    })
  };

  this.getErrorReason = function getErrorReason(id) {
    return errorReasonById[id];
  };

  this.validate = function validate() {
    const newErrorReasonById = validationFn(this);
    setErrorReasonById(newErrorReasonById);
    const errorOcurred = !G.isEmpty(newErrorReasonById);
    return errorOcurred;
  };

  this.validateNotEmpty = function validateNotEmpty(idOrIds) {
    if (Array.isArray(idOrIds)) {
      const ids = idOrIds;
      let result = {};
      ids.forEach(id => {
        result = {...result, ...validateNotEmpty(id)}
      })
      return result;
    } else {
      const id = idOrIds;
      const val = lastValueById[id];
      const missing = !val || G.isWhitespace(val);
      return missing ? {[id]: 'required'} : {};
    }
  };

  this.validateAtLeastOnePresent = function validateAtLeastOnePresent(errorReasonPseudoId, ids) {
    let found = false;
    for (const id of ids) {
      const val = lastValueById[id];
      if (val && !G.isWhitespace(val)) {
        found = true;
        break;
      }
    }

    return found ? {} : {[errorReasonPseudoId]: 'none-present'}
  };

  this.validateLimit = function validateLimit(id, limit) {
    const val = lastValueById[id];
    const limitExceeded = val && val.length > limit;
    return limitExceeded ? {[id]: 'limit'} : {};
  };

  this.getFieldErrorMessage = function getFieldErrorMessage(id) {
    const errorReason = this.getErrorReason(id);
    switch (errorReason) {
      case 'limit':
        return 'too long';
      case 'required':
        return errorReason;
      case undefined:
        return undefined;
      default:
        throw new Error(`unhandled errorReason: ${errorReason}`);
    }
  };

  this.wasError = function wasError() {
    return !G.isEmpty(errorReasonById);
  };

  this.getErrorMessage = function getErrorMessage() {
    return errorMessageFn() || '';
  };

  this.getFilledForm = function getFilledForm() {
    return {...lastValueById};
  };

  this.getValue = function getValue(id) {
    return lastValueById[id];
  };
}