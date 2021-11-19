db.auth('sedBaseBM', 'kHzzHQ45uACiZqFO')

db = db.getSiblingDB('socialMedia')

db.createUser(
    {
        user: "backendRWU",
        pwd: "RAyyYK93aLeUHjf8",
        roles: [
            {
                role: "readWrite",
                db: "socialMedia"
            }
        ]
    }
);