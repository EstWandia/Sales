export const checkPermission = (req, res, next) => {
    //console.log('Entering checkPermission middleware');


    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { perm } = req.session.user;

    if (perm === 1 && req.path.startsWith('/public/pages/reports')) {
        //console.log('Access Denied for perm 1');
        return res.status(403).send('Access Denied');
    }

    next();
};
