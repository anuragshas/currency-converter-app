export const SWAP_CURRENCY = 'SWAP_CURRENCY';
export const CHANGE_CURRENCY_AMOUNT = 'CHANGE_CURRENCY_AMOUNT';
export const CHANGE_BASE_CURRENCY = 'CHANGE_BASE_CURRENCY';
export const CHANGE_QUOTE_CURRENCY = 'CHANGE_QUOTE_CURRENCY';
export const GET_INITIAL_CONVERSION = 'GET_INITIAL_CONVERSION';

export const CONVERSION_RESULT = 'CONVERSION_RESULT';
export const CONVERSION_ERROR = 'CONVERSION_ERROR';


export const getInitialConversion = () => ({
  type: GET_INITIAL_CONVERSION,
});

export const startSwapCurrency = () => ({
  type: SWAP_CURRENCY,
});

export const changeCurrencyAmount = amount => ({
  type: CHANGE_CURRENCY_AMOUNT,
  amount: parseFloat(amount),
});

export const startChangeBaseCurrency = currency => ({
  type: CHANGE_BASE_CURRENCY,
  currency,
});

export const changeQuoteCurrency = currency => ({
  type: CHANGE_QUOTE_CURRENCY,
  currency,
});

const getLatestRate = currency => fetch(`https://fixer.handlebarlabs.com/latest?base=${currency}`);

export const fetchConversion = () => (dispatch, getState) => {
  dispatch(getInitialConversion());
  const currency = getState().currencies.baseCurrency;
  getLatestRate(currency)
    .then((response) => {
      if (!response.ok) {
        if (!response.statusText) {
          response.statusText = 'Some Error Occured';
        }
        throw Error(response.statusText);
      }
      return response;
    })
    .then(response => response.json())
    .then(result => dispatch({ type: CONVERSION_RESULT, result }))
    .catch(error => dispatch({ type: CONVERSION_ERROR, error: error.message }));
};

export const changeBaseCurrency = currency => (dispatch) => {
  dispatch(startChangeBaseCurrency(currency));
  dispatch(fetchConversion());
};

export const swapCurrency = () => (dispatch) => {
  dispatch(startSwapCurrency());
  dispatch(fetchConversion());
};

