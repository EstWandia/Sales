app.use((req, res, next) => {
    // If the user is not logged in, allow access to login page only
    if (!req.session.user) {
        // Allow access to login page only
        if (req.path !== '/login' && req.path !== '/pages/samples/register.html') {
            return res.redirect('/login');
        }
    }

    // Get the user's permission level from the session
    const { perm } = req.session.user || {};

    // If user has perm === 1, allow access to index.html but redirect them to allitems.html for any other page
    if (perm === 1 && req.path !== '/public/pages/samples/allitems.html' && req.path !== '/index.html') {
        return res.redirect('/public/pages/samples/allitems.html');
    }

    // Otherwise, let the request continue
    next();
});
