const updateUserProfile = async function(req,res)
{
    let userId = req.params.userId;

    let updatedDetails = {};

    if(req.body.fname != undefined)
    {
        updatedDetails['fname'] = req.body.fname;  
    }
    
    if(req.body.lname != undefined)
    {
        updatedDetails['lname'] = req.body.lname;  
    }

    if(req.body.email != undefined)
    {
        const emailAlreadyUsed = await UserModel.findOne({ email : req.body.email });

        if(emailAlreadyUsed)

            return res.status(400).send({ status : false, message : `The given email:${req.body.email} has already been used.` });
        
        updatedDetails['email'] = req.body.email;
    }

    if(req.body.profileImage != undefined)
    {
        updatedDetails['profileImage'] = req.body.profileImage;  
    }

    if(req.body.phone != undefined)
    {
        const phoneAlreadyUsed = await UserModel.findOne({ phone : req.body.phone });

        if(phoneAlreadyUsed)

            return res.status(400).send({ status : false, message : `The given phone:${req.body.phone} number has already been used.` });
        
        updatedDetails['phone'] = req.body.phone;  
    }

    if(req.body.password != undefined)
    {
        let password = req.body.password;

        if(!( password.length >= 8 && password.length <= 15 ))

            return res.status(400).send({ status : false, message : "password must be a string of length 8 - 15 characters." });
        
        updatedDetails['password'] = req.body.password;  
    }

    if(req.body.address != undefined)
    {
        let address = JSON.parse(req.body.address);

        updatedDetails['address'] = address;  
    }
    
    const updatedProfile = await UserModel.findByIdAndUpdate(userId,{set : updatedDetails},{new : true});

    if(updatedProfile == null)

        return res.status(404).send({ status : false, message : "User not found."});

    return res.status(200).send({ status : true, message : "User profile updated", data : updatedProfile})
};