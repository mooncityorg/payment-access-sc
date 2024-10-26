import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';
import { GLOBAL_STATE_SEED, LICENSE_INFO_SEED, TOPIC_INFO_SEED, USER_ROLE_SEED, WHITE_LIST_SEED } from "./constants";
import { GlobalState, LicenseInfo, TopicInfo, UserRole, WhiteListInfo } from "./types";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAccount } from "./utils";

export const createInitializeIx = async (
    admin: PublicKey,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);
    const ix = await program.methods
        .initialize()
        .accounts({
            admin,
            globalState,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const transferGlobalAdminIx = async (
    admin: PublicKey,
    newAdmin: PublicKey,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);
    const ix = await program.methods
        .transferGlobalAdmin(newAdmin)
        .accounts({
            admin,
            globalState
        })
        .instruction();

    return ix;
}

export const initUserRoleIx = async (
    user: PublicKey,
    program: anchor.Program
) => {
    const userRole = findUserRolePda(user, program.programId);

    const ix = await program.methods
        .initUserRole()
        .accounts({
            user,
            userRole,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const updateUserRoleIx = async (
    admin: PublicKey,
    user: PublicKey,
    isPublisher: boolean,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);
    const userRole = findUserRolePda(admin, program.programId);

    const ix = await program.methods
        .updateUserRole(isPublisher)
        .accounts({
            admin,
            user,
            globalState,
            userRole,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const createTopicIx = async (
    publisher: PublicKey,
    nftMint: PublicKey,
    costTokenMint: PublicKey,
    licenseCost: anchor.BN,
    program: anchor.Program
) => {
    const userRole = findUserRolePda(publisher, program.programId);
    const topicInfo = findTopicInfoPda(publisher, nftMint, program.programId);

    const ix = await program.methods
        .createTopic(licenseCost)
        .accounts({
            publisher,
            userRole,
            topicInfo,
            nftMint,
            costTokenMint,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const updateTopicIx = async (
    publisher: PublicKey,
    nftMint: PublicKey,
    costTokenMint: PublicKey,
    licenseCost: anchor.BN,
    program: anchor.Program
) => {
    const userRole = findUserRolePda(publisher, program.programId);
    const topicInfo = findTopicInfoPda(publisher, nftMint, program.programId);

    const ix = await program.methods
        .updateTopic(licenseCost)
        .accounts({
            publisher,
            userRole,
            topicInfo,
            nftMint,
            costTokenMint
        })
        .instruction();

    return ix;
}

export const addWhiteListIx = async (
    user: PublicKey,
    publisher: PublicKey,
    subscriber: PublicKey,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);
    const publisherRole = findUserRolePda(publisher, program.programId);
    const whiteListInfo = findWhiteListInfoPda(publisher, subscriber, program.programId);

    const ix = await program.methods
        .addWhiteList()
        .accounts({
            user,
            globalState,
            publisherRole,
            publisher,
            subscriber,
            whiteListInfo,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const removeWhiteListIx = async (
    user: PublicKey,
    publisher: PublicKey,
    subscriber: PublicKey,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);
    const publisherRole = findUserRolePda(publisher, program.programId);
    const whiteListInfo = findWhiteListInfoPda(publisher, subscriber, program.programId);

    const ix = await program.methods
        .removeWhiteList()
        .accounts({
            user,
            globalState,
            publisherRole,
            publisher,
            subscriber,
            whiteListInfo,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const purchaseLicenseIx = async (
    subscriber: PublicKey,
    publisher: PublicKey,
    nftMint: PublicKey,
    costTokenMint: PublicKey,
    program: anchor.Program
) => {
    const subscriberRole = findUserRolePda(subscriber, program.programId);
    const topicInfo = findTopicInfoPda(publisher, nftMint, program.programId);
    const licenseInfo = findLicenseInfoPda(subscriber, topicInfo, program.programId);

    const publisherTokenAccount = await getAssociatedTokenAccount(publisher, costTokenMint);

    const subscriberTokenAccount = await getAssociatedTokenAccount(subscriber, costTokenMint);

    const ix = await program.methods
        .purchaseLicense()
        .accounts({
            subscriber,
            subscriberRole,
            licenseInfo,
            topicInfo,
            publisher,
            publisherTokenAccount,
            subscriberTokenAccount,
            nftMint,
            costTokenMint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .instruction();
    
    return ix;
}

export const revokeLicenseIx = async (
    publisher: PublicKey,
    subscriber: PublicKey,
    nftMint: PublicKey,
    program: anchor.Program
) => {
    const publisherRole = findUserRolePda(publisher, program.programId);
    const topicInfo = findTopicInfoPda(publisher, nftMint, program.programId);
    const licenseInfo = findLicenseInfoPda(subscriber, topicInfo, program.programId);

    const ix = await program.methods
        .revokeLicense()
        .accounts({
            publisher,
            subscriber,
            publisherRole,
            licenseInfo,
            topicInfo,
            nftMint,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}


export const findGlobalStatePda = (programId: PublicKey) => {
    const [globalState] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_STATE_SEED)],
        programId
    );
    return globalState;
}

export const getGlobalState = async (program: anchor.Program) => {
    const globalState = findGlobalStatePda(program.programId);
    const globalPoolData = await program.account.globalState.fetch(globalState);

    return {
        key: globalState,
        data: globalPoolData as unknown as GlobalState,
    };
};

export const getUserRoleInfoState = async (user: PublicKey, program: anchor.Program) => {
    const userRoleInfo = findUserRolePda(user, program.programId);
    // console.log("🚀 ~ getUserRoleInfoState ~ findUserRolePda:", userRoleInfo)
    // console.log(program.account)
    const userRoleInfoData = await program.account.userRole.fetch(userRoleInfo);

    return {
        key: userRoleInfo,
        data: userRoleInfoData as unknown as UserRole,
    };
};

export const getTopicInfoState = async (publisher: PublicKey, nftMint: PublicKey, program: anchor.Program) => {
    const topicInfo = findTopicInfoPda(publisher, nftMint, program.programId);
    const topicInfoData = await program.account.topicInfo.fetch(topicInfo);

    return {
        key: topicInfo,
        data: topicInfoData as unknown as TopicInfo,
    };
};

export const getWhiteListInfoState = async (publisher: PublicKey, subscriber:PublicKey, program: anchor.Program) => {
    const whiteListInfo = findWhiteListInfoPda(publisher, subscriber, program.programId);
    const whiteListInfoData = await program.account.whiteListInfo.fetch(whiteListInfo);

    return {
        key: whiteListInfo,
        data: whiteListInfoData as unknown as WhiteListInfo,
    };
};

export const getLicenseInfoState = async (publisher: PublicKey, subscriber: PublicKey, nftMint: PublicKey, program: anchor.Program) => {
    const topicInfo = findTopicInfoPda(publisher, nftMint, program.programId);
    const licenseInfo = findLicenseInfoPda(subscriber, topicInfo, program.programId);
    const licenseInfoData = await program.account.licenseInfo.fetch(licenseInfo);

    return {
        key: licenseInfo,
        data: licenseInfoData as unknown as LicenseInfo,
    };
};

export const findUserRolePda = (user: PublicKey, programId: PublicKey) => {
    const [userRole] = PublicKey.findProgramAddressSync(
        [Buffer.from(USER_ROLE_SEED), user.toBytes()],
        programId
    );

    return userRole;
}

export const findTopicInfoPda = (publisher: PublicKey, nftMint: PublicKey, programId: PublicKey) => {
    const [topicInfo] = PublicKey.findProgramAddressSync(
        [Buffer.from(TOPIC_INFO_SEED), publisher.toBytes(), nftMint.toBytes()],
        programId
    );

    return topicInfo;
}

export const findWhiteListInfoPda = (publisher: PublicKey, subscriber: PublicKey, programId: PublicKey) => {
    const [whiteListInfo] = PublicKey.findProgramAddressSync(
        [Buffer.from(WHITE_LIST_SEED), publisher.toBytes(), subscriber.toBytes()],
        programId
    )

    return whiteListInfo;
}

export const findLicenseInfoPda = (subscriber: PublicKey, topic: PublicKey, programId: PublicKey) => {
    const [licenseInfo] = PublicKey.findProgramAddressSync(
        [Buffer.from(LICENSE_INFO_SEED), subscriber.toBytes(), topic.toBytes()],
        programId
    );

    return licenseInfo;
}