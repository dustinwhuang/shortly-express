const parseCookies = (req, res, next) => {
  let cookies = req.headers.cookie && req.headers.cookie.split('; ');
  
  req.cookies = req.cookies || {};
  cookies && cookies.forEach(cookie => {
    let [, key, value] = cookie.match(/(.*)=(.*)/);
    req.cookies[key] = value;
  });

  next();
};

module.exports = parseCookies;