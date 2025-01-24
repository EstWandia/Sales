app.use((req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { allowedFlag } = req.session.user;

    if (allowedFlag === 1 && req.originalUrl !== '/public/pages/samples/allitems.html') {
        return res.redirect('/public/pages/samples/allitems.html');
    }

    next();
});
