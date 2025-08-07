from app.core.database import SessionLocal
from app.models.follow import Follow
from app.models.user import User

db = SessionLocal()

# Get users
users = db.query(User).all()
print(f"Found {len(users)} users:")
for user in users:
    print(f"- {user.id}: {user.username}")

# Check follows
follows = db.query(Follow).all()
print(f"\nFound {len(follows)} follows:")
for follow in follows:
    print(f"- User {follow.follower_id} follows User {follow.following_id}")

# Create a test follow if users exist
if len(users) >= 2:
    existing = db.query(Follow).filter(
        Follow.follower_id == users[0].id,
        Follow.following_id == users[1].id
    ).first()
    
    if not existing:
        test_follow = Follow(follower_id=users[0].id, following_id=users[1].id)
        db.add(test_follow)
        db.commit()
        print(f"\nCreated test follow: {users[0].username} -> {users[1].username}")
    else:
        print(f"\nFollow already exists: {users[0].username} -> {users[1].username}")

db.close()