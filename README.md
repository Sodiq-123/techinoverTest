# Drones API

## Table of Contents

- [Introduction](#introduction)
- [Task Description](#task-description)
- [Requirements](#requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non-functional Requirements](#non-functional-requirements)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Documentation](#documentation)

---

:scroll: **START**

### Introduction

The Drones API is a RESTful service that allows clients to interact with a fleet of drones and perform various operations related to medication delivery. The API enables users to register drones, load medication items onto drones, check the loaded medication items, check available drones for loading, and monitor the battery level of drones.

Drones are becoming a disruptive force in the field of transportation, and their capabilities to deliver small items, especially medications, to locations with difficult access make them valuable assets in various industries.

### Task Description

The Drones API provides the following main functionalities:

- Registering a drone: Users can register a new drone with specific attributes such as serial number, model, weight limit, battery capacity, and state.

- Loading a drone with medication items: Users can load medication items onto a specific drone, ensuring that the drone's weight limit is not exceeded.

- Checking loaded medication items: Users can check the medication items loaded on a given drone.

- Checking available drones for loading: Users can check the list of drones available for loading medication items.

- Checking drone battery level: Users can check the battery level of a specific drone.

Please note that this API only handles the communication and management of drones and medication items. The specific communication with the drones is outside the scope of this task.

### Requirements

While implementing the solution, the following requirements should be considered:

#### Functional Requirements

- The API does not require a user interface (UI).

- The API should prevent loading a drone with more weight than it can carry, considering the weight limit of the drone.

- The API should prevent a drone from entering the LOADING state if its battery level is below 25%.

- The API should introduce a periodic task to check drones' battery levels and create a history/audit event log for this.

#### Non-functional Requirements

- Input and output data must be in JSON format.

- The project should be buildable and runnable.

- The project must have a README file with build, run, and test instructions. The database used for testing should be runnable locally, e.g., an in-memory database.

- The required data should be preloaded in the database.

- Unit tests are optional but advisable (if there is time).

- Development commits should follow atomic commit guidelines.

---

:scroll: **END**

## Getting Started

### Prerequisites

- Node.js (v14 or higher) and npm installed on your system.

### Installation

1. Clone the repository.

```bash
git clone https://github.com/Sodiq-123/techinoverTest.git
cd techinoverTest
```

2. Install dependencies.

```bash
npm i
```

### Running the API

1. Create a .env file in the root directory of the project and add the environment variables specified in the .env.example file.

2. Create a database (in this case, a postgres db)and add the database connection string to the .env file in the format: postgres://username:password@host:port/database.

3. Run the migrations.

```bash
npm run migrate:dev
```

4. Start the server: 

- In development:

```bash
npm run start:dev
```

Or

```bash
npm run start
```

- In production:

```bash
npm run start:prod
```

The API will be available at http://localhost:port/api, where <b>port</b> is the port specified in the .env file created and /api is the api prefix (you can check the config/index.ts file to change your api prefix). You can check the .env.example file for the required environment variables.


## Scripts:
lint files
```bash
npm run lint
```

format files
```bash
npm run format
```

seed database
```bash
npm run prisma:seed
```



## API Endpoints

The Drones API provides the following endpoints:

| Endpoint | Description |
| --- | --- |
| POST /drones/register | Register a new drone with the specified attributes. |
| POST /drones/load | Load medication items onto the specified drone. |
| GET /drones/:droneId/loaded-medications | Check the loaded medication items for a given drone. |
| PUT /drones/:droneId/updateState | Update the state of a given drone. |
| GET /drones/available | Check the available drones for loading medication items. |
| GET /drones/:droneId/battery-level | Check the battery level of a specific drone. |
| GET /drones/:droneId | Get a specific drone. |

For detailed information about the API endpoints and request/response formats, please refer to the [API documentation](https://documenter.getpostman.com/view/14459384/2s9XxsVbY5).

This README.md provides an overview of the Drones API, its functionalities, requirements, and instructions to get started with the project. For more detailed information about API endpoints, data structures, and usage, please refer to the provided API documentation. If you have any questions or need further assistance, feel free to reach out.

Author: [Sodiq Agunbiade](https://github.com/Sodiq-123)

