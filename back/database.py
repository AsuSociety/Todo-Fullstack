from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

import os 
load_dotenv()

SQLALCHEMY_DATABASE_URL =os.getenv("DATABASE_URL")

# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread':False})
engine = create_engine(SQLALCHEMY_DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()