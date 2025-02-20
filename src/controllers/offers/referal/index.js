
async function renderCreateReferalPage(req,res){
}

async function createReferalOffer(req,res){
    try{

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

async function renderUpdateReferalPage(req,res){
    
}

async function updateReferal(req,res){
    try{

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

async function deleteReferal(req,res){
    try{

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export {
    renderCreateReferalPage,
    createReferalOffer,
    renderUpdateReferalPage,
    updateReferal,
    deleteReferal
}