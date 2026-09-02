// ==========================================================
// BACHAT BUDDY - CURRENCY.JS
// Centralized Dynamic Currency System
// ==========================================================

"use strict";

// ==========================================================
// CURRENCY CONFIGURATION
// ==========================================================

const CURRENCY_CONFIG = {
  INR: {
    code: "INR",
    locale: "en-IN",
    symbol: "₹",
    decimals: 2,
  },

  USD: {
    code: "USD",
    locale: "en-US",
    symbol: "$",
    decimals: 2,
  },

  EUR: {
    code: "EUR",
    locale: "de-DE",
    symbol: "€",
    decimals: 2,
  },

  GBP: {
    code: "GBP",
    locale: "en-GB",
    symbol: "£",
    decimals: 2,
  },

  JPY: {
    code: "JPY",
    locale: "ja-JP",
    symbol: "¥",
    decimals: 0,
  },

  CNY: {
    code: "CNY",
    locale: "zh-CN",
    symbol: "¥",
    decimals: 2,
  },

  AUD: {
    code: "AUD",
    locale: "en-AU",
    symbol: "A$",
    decimals: 2,
  },

  CAD: {
    code: "CAD",
    locale: "en-CA",
    symbol: "C$",
    decimals: 2,
  },
};

// ==========================================================
// GET SELECTED CURRENCY
// ==========================================================

function getSelectedCurrency() {
  const currency = localStorage.getItem("currency") || "INR";

  return CURRENCY_CONFIG[currency] ? currency : "INR";
}

// ==========================================================
// GET CONFIG
// ==========================================================

function getCurrencyConfig() {
  return CURRENCY_CONFIG[getSelectedCurrency()];
}

// ==========================================================
// GET SYMBOL
// ==========================================================

function getCurrencySymbol() {
  return getCurrencyConfig().symbol;
}

// ==========================================================
// GET CODE
// ==========================================================

function getCurrencyCode() {
  return getCurrencyConfig().code;
}

// ==========================================================
// FORMAT CURRENCY
// ==========================================================

function formatCurrency(amount) {
  const config = getCurrencyConfig();

  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(0);
  }

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(value);
}

// ==========================================================
// FORMAT NUMBER WITHOUT CURRENCY
// ==========================================================

function formatAmount(amount) {
  const config = getCurrencyConfig();

  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(value);
}

// ==========================================================
// UPDATE CURRENCY SYMBOLS
//
// HTML example:
//
// <span data-currency-symbol></span>
// ==========================================================

function updateCurrencySymbols() {
  const symbol = getCurrencySymbol();

  const elements = document.querySelectorAll("[data-currency-symbol]");

  elements.forEach(function (element) {
    element.textContent = symbol;
  });
}

// ==========================================================
// UPDATE CURRENCY ELEMENTS
//
// HTML:
//
// <span data-currency="12500"></span>
//
// This automatically becomes:
// ₹12,500.00
//
// or
//
// $12,500.00
// ==========================================================

function updateCurrencyElements() {
  const elements = document.querySelectorAll("[data-currency]");

  elements.forEach(function (element) {
    const amount = element.getAttribute("data-currency");

    if (amount === null || amount === "") {
      return;
    }

    element.textContent = formatCurrency(amount);
  });
}

// ==========================================================
// UPDATE ALL CURRENCY UI
// ==========================================================

function updateCurrencyUI() {
  updateCurrencySymbols();

  updateCurrencyElements();

  console.log("Currency UI updated:", getSelectedCurrency());
}

// ==========================================================
// CHANGE CURRENCY
// ==========================================================

function notifyCurrencyChanged(currency) {
  const selectedCurrency =
    currency && CURRENCY_CONFIG[currency] ? currency : getSelectedCurrency();

  // Save locally

  localStorage.setItem("currency", selectedCurrency);

  console.log("Currency changed to:", selectedCurrency);

  // Update current page

  updateCurrencyUI();

  // Notify other scripts

  window.dispatchEvent(
    new CustomEvent("currencyChanged", {
      detail: {
        currency: selectedCurrency,

        symbol: CURRENCY_CONFIG[selectedCurrency].symbol,

        config: CURRENCY_CONFIG[selectedCurrency],
      },
    }),
  );
}

// ==========================================================
// CURRENCY CHANGE EVENT
// ==========================================================

window.addEventListener("currencyChanged", function (event) {
  const currency =
    event.detail && event.detail.currency
      ? event.detail.currency
      : getSelectedCurrency();

  // Make sure localStorage is updated

  if (CURRENCY_CONFIG[currency]) {
    localStorage.setItem("currency", currency);
  }

  updateCurrencyUI();
});

// ==========================================================
// STORAGE CHANGE
// Useful when another browser tab changes currency
// ==========================================================

window.addEventListener("storage", function (event) {
  if (event.key !== "currency") {
    return;
  }

  const newCurrency =
    event.newValue && CURRENCY_CONFIG[event.newValue] ? event.newValue : "INR";

  console.log("Currency changed from another tab:", newCurrency);

  localStorage.setItem("currency", newCurrency);

  updateCurrencyUI();

  window.dispatchEvent(
    new CustomEvent("currencyChanged", {
      detail: {
        currency: newCurrency,

        symbol: CURRENCY_CONFIG[newCurrency].symbol,

        config: CURRENCY_CONFIG[newCurrency],
      },
    }),
  );
});

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  updateCurrencyUI();
});

// ==========================================================
// GLOBAL FUNCTIONS
// ==========================================================

window.getSelectedCurrency = getSelectedCurrency;

window.getCurrencyConfig = getCurrencyConfig;

window.formatCurrency = formatCurrency;

window.formatAmount = formatAmount;

window.getCurrencySymbol = getCurrencySymbol;

window.getCurrencyCode = getCurrencyCode;

window.updateCurrencySymbols = updateCurrencySymbols;

window.updateCurrencyElements = updateCurrencyElements;

window.updateCurrencyUI = updateCurrencyUI;

window.notifyCurrencyChanged = notifyCurrencyChanged;
