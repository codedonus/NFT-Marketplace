const { hexConcat } = require("ethers/lib/utils");

const main = async () => {
    const [guy, randomGuy] = await hre.ethers.getSigners();
    console.log('Guy\'s address:', guy.address);

    const ethwei = hre.ethers.utils;

    const nftContractFactory = await hre.ethers.getContractFactory("testNFT");
    const nftContract = await nftContractFactory.deploy();

    const marketContractFactory = await hre.ethers.getContractFactory("NFTMarket");
    const marketContract = await marketContractFactory.deploy();
    console.log("Contract deployed to:", marketContract.address);

    const mintNFT = await nftContract.mint();
    await mintNFT.wait();

    const _mintNFT = await nftContract.mint();
    await _mintNFT.wait();

    const _approve = await nftContract.setApprovalForAll(marketContract.address, true);
    const _list = await marketContract.listNFT(nftContract.address, 1, hre.ethers.utils.parseEther('1'));

    const _0status = await marketContract.getListStatus(nftContract.address, 0);
    console.log("NFT#0 listed status:", _0status);
    console.log("Price of #0:", await marketContract.getListPrice(nftContract.address, 0));
    console.log("Price of #1:", await marketContract.getListPrice(nftContract.address, 1));

    const _0ow = await marketContract.getNFTOwner(nftContract.address, 0);
    console.log("NFT#0's owner is", _0ow);

    const _1ow = await marketContract.getNFTOwner(nftContract.address, 1);
    console.log("NFT#1's owner is", _1ow);

    const _1status = await marketContract.getListStatus(nftContract.address, 1);
    console.log("NFT#1 listed status:", _1status);

    const _buy = await marketContract.connect(randomGuy).buyNFT(nftContract.address, 1, {value: hre.ethers.utils.parseEther('1')});
    const _1own = await marketContract.getNFTOwner(nftContract.address, 1);
    console.log("NFT#1's owner is", _1own);

    console.log(hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(guy.address)));
    console.log(hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(randomGuy.address)));

    const _2 = await nftContract.connect(randomGuy).mint();
    const _2apv = await nftContract.connect(randomGuy).setApprovalForAll(marketContract.address, true);
    const _2l = await marketContract.connect(randomGuy).listNFT(nftContract.address, 2, hre.ethers.utils.parseEther('0.01'));

    const _detail = await marketContract.getNFTsDetail(nftContract.address, 3);
    console.log(_detail);

    const __mintNFT = await nftContract.mint();
    await __mintNFT.wait();
    console.log('owner of #3:', await nftContract.ownerOf(3));

    const __list = await marketContract.listNFT(nftContract.address, 3, ethwei.parseEther('1'));
    console.log('3 listed, price: ', await marketContract.getListPrice(nftContract.address, 3));
    const _updatelist = await marketContract.updatePrice(nftContract.address, 3, ethwei.parseEther('10'))
    console.log('3 updated, price:', await marketContract.getListPrice(nftContract.address, 3));
    const _buy_ = await marketContract.connect(randomGuy).buyNFT(nftContract.address, 3, {value: ethwei.parseEther('100')});
    console.log('bought, owner of #3:', await nftContract.ownerOf(3));

    const _mintNFT__ = await nftContract.mint();
    await _mintNFT__.wait();
    console.log('Guy\'s address:', guy.address);

    const chainId = await guy.getChainId(); // 1337
    // console.log('test chainId:', chainId);
    const nonce = 0;
    const name = "SignToList";
    const version = "1";
    const token = marketContract.address;
    const tokenId = 4;
    const _tokenPrice = 100;
    const deadline = 100;

    let sig = ethers.utils.splitSignature(
        await guy._signTypedData(
            {
                name,
                version,
                chainId,
                verifyingContract: token
            },
            {
            ListNFT: [
                {
                    name: "_NFTContract",
                    type: "address",
                },
                {
                    name: "_tokenId",
                    type: "uint256",
                },
                {
                    name: "_price",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
            },
            {
                _NFTContract: nftContract.address,
                _tokenId: tokenId,
                nonce: nonce,
                _price: _tokenPrice,
                deadline: deadline,
            }
        )
    )
    console.log(sig.v, sig.r, sig.s);
    const _buyWithSig = await marketContract.connect(randomGuy).listNFTwithSig(nftContract.address, 4, 100, 100, sig.v, sig.r, sig.s);
    await _buyWithSig.wait();
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch(error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();