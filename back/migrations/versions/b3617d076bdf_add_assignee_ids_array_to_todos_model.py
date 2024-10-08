"""Add assignee_ids array to Todos model

Revision ID: b3617d076bdf
Revises: 939285feb0cb
Create Date: 2024-08-05 20:03:30.642980

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b3617d076bdf'
down_revision: Union[str, None] = '939285feb0cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('todos', sa.Column('assignee_ids', sa.ARRAY(sa.UUID()), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('todos', 'assignee_ids')
    # ### end Alembic commands ###
