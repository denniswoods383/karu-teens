from sqlalchemy.orm import Session
from ..models.badge import Badge, UserBadge
from ..models.user import User
from ..models.post import Post
from ..models.like import Like
from ..models.follow import Follow
from ..models.post import Comment

class BadgeService:
    def __init__(self, db: Session):
        self.db = db
    
    def check_and_award_badges(self, user_id: int):
        """Check all badge requirements and award new badges"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        
        # Get user's current badges
        current_badges = self.db.query(UserBadge.badge_id).filter(UserBadge.user_id == user_id).all()
        current_badge_ids = [b[0] for b in current_badges]
        
        # Get all available badges
        badges = self.db.query(Badge).filter(Badge.is_active == True).all()
        
        new_badges = []
        
        for badge in badges:
            if badge.id in current_badge_ids:
                continue  # User already has this badge
            
            if self._check_badge_requirement(user_id, badge):
                # Award badge
                user_badge = UserBadge(user_id=user_id, badge_id=badge.id)
                self.db.add(user_badge)
                new_badges.append(badge)
        
        if new_badges:
            self.db.commit()
        
        return new_badges
    
    def _check_badge_requirement(self, user_id: int, badge: Badge) -> bool:
        """Check if user meets badge requirement"""
        if badge.requirement_type == 'posts':
            count = self.db.query(Post).filter(Post.author_id == user_id).count()
            return count >= badge.requirement_count
        
        elif badge.requirement_type == 'likes_received':
            count = self.db.query(Like).join(Post).filter(Post.author_id == user_id).count()
            return count >= badge.requirement_count
        
        elif badge.requirement_type == 'followers':
            count = self.db.query(Follow).filter(Follow.following_id == user_id).count()
            return count >= badge.requirement_count
        
        elif badge.requirement_type == 'comments':
            count = self.db.query(Comment).filter(Comment.author_id == user_id).count()
            return count >= badge.requirement_count
        
        elif badge.requirement_type == 'early_user':
            # Check if user is among first N users
            user_rank = self.db.query(User).filter(User.id <= user_id).count()
            return user_rank <= badge.requirement_count
        
        return False
    
    def get_user_badges(self, user_id: int):
        """Get all badges for a user"""
        badges = self.db.query(Badge).join(UserBadge).filter(
            UserBadge.user_id == user_id
        ).all()
        
        return [{
            'id': badge.id,
            'name': badge.name,
            'description': badge.description,
            'icon': badge.icon,
            'color': badge.color
        } for badge in badges]