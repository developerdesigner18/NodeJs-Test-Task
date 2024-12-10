const { Op } = require("sequelize");
const People = require("../models/people");
const sequelize = require("../config/database");

exports.getPeople = async (req, res) => {
  try {
    const people = await People.findAll();
    if (!people.length) {
      console.log('No people found in the database.');
    }
    res.status(200).json(people);
  } catch (err) {
    console.error("Error fetching people:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add a person
exports.addPerson = async (req, res) => {
  try {
    const person = await People.create(req.body);
    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Add multiple people
exports.addMultiplePeople = async (req, res) => {
  const { people } = req.body; // Expect an array of people objects
  try {
    const addedPeople = await People.bulkCreate(people); // Sequelize bulk insert
    res.status(201).json(addedPeople);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterPeople = async (req, res) => {
  const { ids, filter, columns } = req.body;
  const where = {}; // Sequelize WHERE clause object
  console.log('Request Body:', req.body); // Log the full request body

  try {
    // Handle ID filtering (if `ids` is provided)
    if (ids) {
      where.peopleId = {
        [Op.in]: ids.split(",").map(Number), // Convert comma-separated IDs to an array of numbers
      };
    }

    // If no IDs are provided, filter on string fields
    if (filter) {
      console.log('Applying String Filters...');
      
      // Dynamically get all string fields from the model
      const stringFields = Object.keys(People.rawAttributes).filter(field => {
        const dataType = People.rawAttributes[field].type.key;
        return ["STRING", "TEXT"].includes(dataType); // Filter only string and text fields
      });

      // Apply string-based filters (startsWith, endsWith, contains) with case-insensitive matching
      const orConditions = []; // To hold OR conditions for each string field

      if (filter.startsWith) {
        stringFields.forEach(field => {
          orConditions.push({
            [field]: {
              [Op.iLike]: `${filter.startsWith}%` // Apply to each field independently
            }
          });
        });
      }

      if (filter.endsWith) {
        stringFields.forEach(field => {
          orConditions.push({
            [field]: {
              [Op.iLike]: `%${filter.endsWith}` // Apply to each field independently
            }
          });
        });
      }

      if (filter.contains) {
        stringFields.forEach(field => {
          orConditions.push({
            [field]: {
              [Op.iLike]: `%${filter.contains}%` // Apply to each field independently
            }
          });
        });
      }

      // If we have any OR conditions, apply them to the WHERE clause
      if (orConditions.length > 0) {
        where[Op.or] = orConditions;
      }
    }

    // Log the where clause to debug
    console.log('Where Clause:', where);

    // Fetch filtered data
    const people = await People.findAll({
      where,
      attributes: columns || undefined, // Return only specified columns, if provided
      logging: console.log  // This will log the generated SQL query
    });

    console.log('Fetched People:', people); // Log fetched data
    res.status(200).json(people);
  } catch (err) {
    console.error("Error filtering people:", err);
    res.status(500).json({ error: "Failed to fetch people based on filters." });
  }
};