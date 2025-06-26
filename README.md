# CapitalStream - Banking Dashboard

A modern, secure banking dashboard application built with Angular and Node.js/Express.

## Features

- **Account Management**: View and manage multiple bank accounts
- **Transaction History**: Detailed transaction tracking with filtering and search
- **Interactive Charts**: Visual representation of spending patterns and account balances
- **Security Features**: JWT authentication, secure API endpoints, role-based access
- **Responsive Design**: Modern UI that works on desktop and mobile devices

## Tech Stack

### Frontend
- **Angular 17+**: Modern web framework
- **Angular Material**: UI component library
- **Chart.js**: Data visualization
- **RxJS**: Reactive programming
- **JavaScript**: Dynamic programming language

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **PostgreSQL**: Database
- **Sequelize**: ORM for database operations
- **CORS**: Cross-origin resource sharing

## Project Structure

```
CapitalStream/
├── frontend/           # Angular application
├── backend/           # Node.js/Express API
├── database/          # Database scripts
└── docs/             # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CapitalStream.git
   cd CapitalStream
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ng serve
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb capitalstream
   
   # Run schema
   psql -d capitalstream -f database/schema.sql
   ```

## Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=8080

DB_HOST=localhost
DB_PORT=5432
DB_NAME=capitalstream
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:4200
```

### Frontend Environment

Update `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Development

- Frontend runs on `http://localhost:4200`
- Backend API runs on `http://localhost:8080`
- Database runs on `localhost:5432`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Account Endpoints
- `GET /api/accounts` - Get user accounts
- `GET /api/accounts/:id` - Get account details
- `GET /api/accounts/:id/stats` - Get account statistics

### Transaction Endpoints
- `GET /api/transactions` - Get transactions (with filtering)
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create new transaction

## Security Features

- JWT token authentication
- Role-based access control (Admin, Customer)
- Secure password hashing with bcrypt
- CORS configuration
- API rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Test Data

The database schema includes sample data for testing:

### Users
- **Admin**: admin@capitalstream.com (password: Admin123!)
- **Customer**: john.doe@email.com (password: Customer123!)

### Sample Accounts
- Checking Account: $5,250.75
- Savings Account: $15,000.00
- Credit Card: -$850.25

## Deployment

### Azure Deployment (Recommended for Student Credits)

#### Backend Deployment to Azure App Service
1. Create an Azure App Service:
   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name capitalstream-backend --runtime "NODE|18-lts"
   ```

2. Configure Azure Database for PostgreSQL:
   ```bash
   az postgres server create --resource-group myResourceGroup --name capitalstream-db --location eastus --admin-user dbadmin --admin-password YourPassword123! --sku-name GP_Gen5_2
   ```

3. Set environment variables in Azure App Service:
   - `DATABASE_URL`: Connection string from Azure PostgreSQL
   - `JWT_SECRET`: Secure random string
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your Netlify domain

4. Deploy from GitHub:
   - Connect your GitHub repository
   - Set build command to `npm install`
   - Set startup file to `server.js`

#### Frontend Deployment to Netlify
1. Connect GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/capitalstream-frontend`
   - Base directory: `frontend`

3. Configure environment variables:
   - `NG_APP_API_URL`: Your Azure App Service URL

#### Database Setup
1. Run the schema on Azure PostgreSQL:
   ```bash
   psql "host=capitalstream-db.postgres.database.azure.com port=5432 dbname=postgres user=dbadmin@capitalstream-db password=YourPassword123! sslmode=require" -f database/schema.sql
   ```

### Production Checklist
- [ ] Update environment variables for Azure
- [ ] Change default passwords in schema.sql
- [ ] Configure HTTPS (auto-enabled in Azure)
- [ ] Set up database backups in Azure
- [ ] Configure Application Insights monitoring
- [ ] Update CORS origins for production
- [ ] Enable compression in Azure App Service
- [ ] Configure Azure CDN

### Database Backup
```bash
pg_dump -U username -h hostname capitalstream > backup.sql
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@capitalstream.com or create an issue on GitHub.
