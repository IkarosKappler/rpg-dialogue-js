// Get the URI GET params as an assoc.
//
// A nicer version with regex
// Found at
//    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
export const gup = () => {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_m, key: string, value: string, ...args) => {
    vars[key] = value;
    return value;
  });
  return vars;
};
