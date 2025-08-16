# models Directory

## Purpose
This directory contains the data models (schemas) for MongoDB collections. Models define the structure, types, and rules for the data stored in the database.

## Definition
A model is a blueprint for how data is organized and validated in a database. In Mongoose (MongoDB ODM), models are created using schemas that specify field types and constraints.

## Example & Analogy
- **Analogy:** Think of models as the blueprint for a house. Before building, you need a plan that shows where rooms, doors, and windows go. Models are the plan for your data.
- **Example:** The `org.js` model defines what an organization looks like in the database (name, description, etc.).

## For Newcomers
If you want to change what data is stored or how it’s validated, update the models in this directory.
