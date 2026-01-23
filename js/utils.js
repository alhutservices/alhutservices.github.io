// دوال مساعدة عامة
function formatCurrency(value) {
  return new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD' }).format(value);
}
