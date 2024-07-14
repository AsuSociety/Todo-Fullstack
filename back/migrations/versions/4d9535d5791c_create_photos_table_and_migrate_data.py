"""Create photos table and migrate data

Revision ID: 4d9535d5791c
Revises: 1e4f8bed4a98
Create Date: 2024-07-12 16:36:33.714361
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import orm

# Import your models here
from models import Todos, Photo  # Adjust this import based on your actual model locations

# revision identifiers, used by Alembic.
revision: str = '4d9535d5791c'
down_revision: Union[str, None] = '1e4f8bed4a98'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def generate_photo_url(photo_path):
    # Implement your logic to generate photo URL from photo path
    return f"/uploads/{photo_path.split('/')[-1]}"

def upgrade():
    # Check if the 'photos' table exists
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    
    if 'photos' not in inspector.get_table_names():
        # Create the new photos table
        op.create_table(
            'photos',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('todo_id', sa.Integer(), sa.ForeignKey('todos.id'), nullable=True),
            sa.Column('photo_path', sa.String(), nullable=False),
            sa.Column('photo_url', sa.String(), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
    
    # Migrate existing data to the new photos table
    session = orm.Session(bind=bind)

    todos = session.execute(sa.select(Todos)).scalars().all()
    for todo in todos:
        # Make sure to handle cases where photo_path is None or not present
        if getattr(todo, 'photo_path', None):
            photo_url = generate_photo_url(todo.photo_path)
            photo = Photo(todo_id=todo.id, photo_path=todo.photo_path, photo_url=photo_url)
            session.add(photo)

    session.commit()

    # Drop the old photo_path column if it exists
    if 'photo_path' in [col['name'] for col in inspector.get_columns('todos')]:
        op.drop_column('todos', 'photo_path')

def downgrade():
    # Add the photo_path column back to the todos table
    op.add_column('todos', sa.Column('photo_path', sa.String(), nullable=True))

    # Migrate data back to the todos table
    bind = op.get_bind()
    session = orm.Session(bind=bind)

    photos = session.execute(sa.select(Photo)).scalars().all()
    for photo in photos:
        todo = session.execute(sa.select(Todos).where(Todos.id == photo.todo_id)).scalar()
        if todo:
            todo.photo_path = photo.photo_path

    session.commit()

    # Drop the photos table
    op.drop_table('photos')
