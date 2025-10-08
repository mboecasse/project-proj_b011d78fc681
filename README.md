genesis-rest-api/
├── src/
│   ├── config/
│   │   └── env.js                    # Environment variable configuration
│   ├── controllers/
│   │   ├── healthController.js       # Health check endpoint logic
│   │   └── testEntityController.js   # Test entity CRUD operations
│   ├── middleware/
│   │   ├── errorHandler.js           # Global error handling middleware
│   │   ├── rateLimiter.js            # Rate limiting configuration
│   │   ├── requestLogger.js          # HTTP request logging setup
│   │   ├── security.js               # Security headers and CORS
│   │   └── validationMiddleware.js   # Request validation helper
│   ├── models/
│   │   └── testEntity.js             # In-memory data model
│   ├── routes/
│   │   ├── healthRoutes.js           # Health check routes
│   │   ├── testEntityRoutes.js       # Test entity CRUD routes
│   │   └── index.js                  # Route aggregator
│   ├── utils/
│   │   ├── logger.js                 # Custom logging utility
│   │   ├── responseFormatter.js      # Standardized API responses
│   │   └── testEntityValidator.js    # Validation rules for entities
│   ├── app.js                        # Express application setup
│   └── server.js                     # HTTP server entry point
├── tests/
│   ├── setup.js                      # Jest global test configuration
│   ├── health.test.js                # Health endpoint tests
│   └── testEntity.test.js            # Test entity CRUD tests
├── .env.example                      # Environment variable template
├── .gitignore                        # Git ignore rules
├── jest.config.js                    # Jest testing configuration
├── package.json                      # NPM dependencies and scripts
└── README.md                         # Project documentation
