const parse = require('nodemon/lib/cli/parse');
const mongoUser = require('../models/mongoSchema');
const Sequelize = require('sequelize')
const mysqlUser = require('../models/mysqlSchema');
const Op = Sequelize.Op
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

async function getAll(req, res, next) {
    try {
        const user = await mysqlUser.findAll({ attributes: ['name', 'about'] })
        console.log(user)
        if (user.length > 0) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: 'No data exist' });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
};

async function getOne(req, res, next) {
    try {
        // var condition = t{ title: { [Op.like]: `%${title}%` } } : null;
        // Tutorial.findAll({ where: condition })
        const user = await mysqlUser.findOne(
            // {attributes: ['name', 'about']},
            { where: { name: req.params.name } }
        )
        console.log(user)
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Invalid id' });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

async function signUp(req, res, next) {
    const filePath = `${req.file.destination}/${req.file.filename}`
    if (!req.body) {
        return res.status(400).send('missing body content');
    }
    const mysqluser = await mysqlUser.findOne({ where: { mobile: req.body.mobile } });
    const mongouser = await mongoUser.findOne({ mobile: req.body.mobile });
    if (mysqluser && mongouser) {
        console.log(req.body.mobile)
        return res.status(409).json({
            message: "Number exist already"
        });
    } else {
        // hashing password
        bcrypt.hash(req.body.pass, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                try {
                    const mongouser = new mongoUser({
                        mobile: req.body.mobile,
                        pass: hash
                    })
                    const info = new mysqlUser({
                        name: req.body.name,
                        about: req.body.about,
                        dob: req.body.dob,
                        mobile: req.body.mobile,
                        email: req.body.email,
                        image: filePath
                    })
                    mongouser.save();
                    // console.log('ok')
                    // console.log(mysqlUser)
                    const temp = await info.save()
                    res.status(200).json({
                        message: 'Adding user',
                        addedUser: temp
                    })
                } catch (err) {
                    res.status(500).json({
                        error: err
                    })
                }
            }
        });
    }


}

async function login(req, res, next) {
    try {
        const mongouser = await mongoUser.findOne({ mobile: req.body.mobile });
        if (!mongouser) {
            return res.status(401).json({ message: 'Wrong credentials' });
        }
        bcrypt.compare(req.body.pass, mongouser.pass, async (err, result) => {
            if (err) {
                return res.status(401).json({ message: "Wrong credentials" });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        mobile: mongouser.mobile,
                        name: mongouser.name
                    },
                    process.env.JWT_KEY, { expiresIn: '90d' }
                );
                const result = await mongoUser.findOneAndUpdate({ mobile: req.body.mobile }, { $set:{tokenSave: token} })
                console.log(result)
                return res.status(200).json({
                    message: "Login successful",
                    tokenSave: result.tokenSave,
                    token: token

                });
            }
            res.status(401).json({
                message: "Wrong credentials"
            });

        });
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }

}
async function logout(req, res, next) {
    
    try {
        const mobileNo = req.params.key;
        // console.log(mobile);
        const mongouser = await mongoUser.findOne({mobile:mobileNo});
        if (mongouser.tokenSave == undefined) {
            return res.status(401).json({ message: 'user not login' });
        }else{
        const result = await mongoUser.findOneAndUpdate({mobile:mobileNo},{$set:{tokenSave:null}})
        console.log(result)
        return res.status(200).json({
            message: "Logout successful",
            mobile: result.mobile
        });
    }}catch (err) {
    res.status(500).json({
        error: err
    })
}

}

async function updateUser(req, res, next) {
    const mobileNo = req.params.key;
    try {
        const updateFields = {};
        for (const fields of req.body) {
            updateFields[fields.propName] = fields.value;
        }
        const mysqluser = await mysqlUser.update(updateFields, { where: { mobile: mobileNo } })
        if (mysqluser) {
            res.status(200).json({
                message: 'updated',
            });
        } else {
            res.status(404).json({ message: 'Invalid mobile' });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }

}
async function deleteUser(req, res, next) {
    const mobileNo = req.params.key;
    try {
        const mysqluser = await mysqlUser.destroy({ where: { mobile: mobileNo } })
        const mongouser = await mongoUser.findOneAndDelete({ mobile: mobileNo })
        if (mysqluser || mongouser) {
            res.status(200).json({
                message: 'deleted',
                deletedUser: mysqluser,
                deletedCreds: mongouser
            });
        } else {
            res.status(404).json({ message: 'Invalid id' });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}


module.exports = {
    getAll: getAll,
    getOne: getOne,
    signUp: signUp,
    login: login,
    logout:logout,
    updateUser: updateUser,
    deleteUser: deleteUser
}