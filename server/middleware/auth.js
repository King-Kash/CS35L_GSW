//this is a middlewearfunction
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/users/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    return next()
}

export {
    checkAuthenticated,
    checkNotAuthenticated,
}