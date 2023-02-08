const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// exports.signup = (req, res) => {  
//     const  {name, email, password} = req.body

//     User.findOne({email}).exec((err, user) => {
//         if(user) {
//             return res.status(400).json({
//                 error: 'Email is taken'
//             })
//         }
//     }) 

//     let newUser = new User({name, email, password})

//     newUser.save((err, success) => {
//         if(err) {
//             console.log('SIGNUP ERROR', err)
//             return res.status(400).json({
//                 error: err
//             })
//         }
//         res.json({
//             message: 'Signup success! Please signin'
//         })
//     })
//     // console.log('REQ BODY ON SIGNUP', req.body)  
//     // res.json({
//     //     data: 'you hit signup endpoint'
//     // })
// }

exports.signup = (req, res) => {
    const {name, email, password} = req.body

    User.findOne({ email }).exec((err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT, {expiresIn: '10m'})

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link`,
            html: `
              <p>Please use the following link to activate your account</p>
              <p>${process.env.CLIENT_URL}/auth/activate</p>
              <hr />
              <p>This email may contain sensetive information</p>
              <p>${process.env.CLIENT_URL}</p>
            `
        }

        sgMail.send(emailData).then(sent => {
            console.log('SIGNUP EMAIL', sent)
            return res.json({
                message: `Email has been sent to ${email}. Follow the instruction`
            })
        })
    })
}

exports.accountActivation = (req, res) => {
    const {token} = req.body

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT, function(err, decoded) {
            if(err) {
                console.log('JWT VERIFY ACCOUNT ACTIVATION ERROR', err)
                return res.status(401).json({
                    error: 'Expired link'
                })
            }

            const {name, email, password} = jwt.decode(token)

            const user = new User({name, email, password})

            user.save((err, user) => {
                if(err) {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
                    return res.status(401).json({
                        error: 'Error saving user in database'
                    })
                } 
                return res.json({
                    message: 'Signup success. Please signin'
                })
            })
        })
    } else {
        return res.json({
            message: 'Something went wrong'
        })
    }
}

/**
  check if user is trying to signin but havent signup yet
  check if password match with hash password that is saved in db
  if yes generate token with expiry
  the token will be sent to client/react
  it will be used as jwt based authentication system
  we can allow user to access protected routes later if they have valid token
  so jwt token is like password with expiry
  in successful signin we will send user info and valid token
  this token will be send back to server from client/react to access protected routes later 
 */

exports.signin = (req, res) => {
  const {email, password} = req.body;

  User.findOne({email}).exec((err, user) => {
    if(err || !user) {
        return res.status(400).json({
            error: 'User with that email does not exist.'
        })
    } 
    if(!user.authenticate(password)) {
        return res.status(400).json({
            error: 'Email and password do not match'
        })
    }
    
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expirseIn: '7d'})
    const {_id, name, email, role} = user

    return res.json({
        token,
        user: { _id, name, email, role }
    })
  })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
})

exports.adminMiddleware = (req, res, next) => {
    User.findById({_id: req.user._id}.exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            })
        }

        if(user.role !== 'admin') {
            return res.status(400).json({
                error: 'User with that email does not exist'
            })            
        }

        req.profile = user;
        next()
    }))
}








