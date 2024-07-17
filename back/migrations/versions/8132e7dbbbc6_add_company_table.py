"""add company table

Revision ID: 8132e7dbbbc6
Revises: 4d9535d5791c
Create Date: 2024-07-15 10:34:12.008401

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision: str = '8132e7dbbbc6'
down_revision: Union[str, None] = '4d9535d5791c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def table_exists(table_name: str) -> bool:
    """Check if a table exists in the database."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    return table_name in inspector.get_table_names()

def column_exists(table_name: str, column_name: str) -> bool:
    """Check if a column exists in a table."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    columns = [c['name'] for c in inspector.get_columns(table_name)]
    return column_name in columns

def upgrade():
    # Creating the 'companies' table if it does not exist
    if not table_exists('companies'):
        op.create_table(
            'companies',
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('name', sa.String(length=255), nullable=False)
        )

    # Adding a new column to 'users' table within a batch operation
    with op.batch_alter_table('users', schema=None) as batch_op:
        if not column_exists('users', 'company_id'):
            batch_op.add_column(sa.Column('company_id', sa.Integer, nullable=True))
            batch_op.create_foreign_key('fk_users_company_id', 'companies', ['company_id'], ['id'])  # Naming the foreign key constraint

def downgrade():
    # Dropping the column and foreign key constraint from 'users' table
    with op.batch_alter_table('users', schema=None) as batch_op:
        if column_exists('users', 'company_id'):
            batch_op.drop_constraint('fk_users_company_id', type_='foreignkey')  # Dropping the foreign key constraint
            batch_op.drop_column('company_id')

    # Dropping the 'companies' table if it exists
    if table_exists('companies'):
        op.drop_table('companies')
