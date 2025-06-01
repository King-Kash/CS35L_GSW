import { error } from "console"

//this is a middlewearfunction
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.json({error: "User not authenticated."})
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.json({error: "User already authenticated."})
    }
    return next()
}

export {
    checkAuthenticated,
    checkNotAuthenticated,
}