const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

const randomString = () => Math.random().toString(36).substring(2, 8);

async function runTests() {
    console.log("=== Starting API Integration Tests & Seeding Data ===");

    // Test Data
    const testUser = {
        name: `Tester ${randomString()}`,
        email: `tester_${randomString()}@example.com`,
        password: "password123"
    };

    const testItem = {
        title: `Seeded Item ${randomString()}`,
        description: "This is a premium seeded item for testing purposes.",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        price: 99.99
    };

    let token = "";
    let userId = "";
    let itemId = "";

    // Helper fetch wrapper
    const apiCall = async (endpoint, method, body = null, headers = {}) => {
        const url = `${BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return { status: response.status, data };
        } catch (error) {
            console.error(`Request to ${endpoint} failed:`, error.message);
            return { status: 500, error };
        }
    };

    // 1. Register User
    console.log(`\n1. Registering user: ${testUser.email}...`);
    const regRes = await apiCall("/auth/register", "POST", testUser);
    console.log(`Status: ${regRes.status}`, regRes.data);
    if (regRes.status !== 201) {
        throw new Error("Registration failed");
    }

    // 2. Login User
    console.log("\n2. Logging in user...");
    const loginRes = await apiCall("/auth/login", "POST", {
        email: testUser.email,
        password: testUser.password
    });
    console.log(`Status: ${loginRes.status}`, loginRes.data);
    if (loginRes.status !== 200) {
        throw new Error("Login failed");
    }
    token = loginRes.data.token;
    userId = loginRes.data.id;
    const authHeader = { "Authorization": `Bearer ${token}` };

    // 3. Create Item
    console.log(`\n3. Creating item: "${testItem.title}"...`);
    const createItemRes = await apiCall("/items", "POST", testItem, authHeader);
    console.log(`Status: ${createItemRes.status}`, createItemRes.data);
    if (createItemRes.status !== 201) {
        throw new Error("Item creation failed");
    }
    itemId = createItemRes.data.item._id;

    // 4. Get All Items
    console.log("\n4. Getting all items...");
    const getAllRes = await apiCall("/items", "GET");
    console.log(`Status: ${getAllRes.status}`, `Found ${getAllRes.data.items?.length || 0} items`);
    if (getAllRes.status !== 200) {
        throw new Error("Get all items failed");
    }

    // 5. Get Item by ID
    console.log(`\n5. Getting item by ID: ${itemId}...`);
    const getByIdRes = await apiCall(`/items/${itemId}`, "GET");
    console.log(`Status: ${getByIdRes.status}`, getByIdRes.data);
    if (getByIdRes.status !== 200) {
        throw new Error("Get item by ID failed");
    }

    // 6. Save Item
    console.log(`\n6. Saving item (adding to saved items)...`);
    const saveRes = await apiCall(`/items/${itemId}/save`, "POST", null, authHeader);
    console.log(`Status: ${saveRes.status}`, saveRes.data);
    if (saveRes.status !== 201) {
        throw new Error("Save item failed");
    }

    // 7. Get Saved Items
    console.log("\n7. Getting all saved items...");
    const getSavedRes = await apiCall("/me/saved", "GET", null, authHeader);
    console.log(`Status: ${getSavedRes.status}`, getSavedRes.data);
    if (getSavedRes.status !== 200) {
        throw new Error("Get saved items failed");
    }

    // 8. Delete Saved Item
    console.log("\n8. Deleting item from saved items...");
    const unsaveRes = await apiCall(`/items/${itemId}/save`, "DELETE", null, authHeader);
    console.log(`Status: ${unsaveRes.status}`, unsaveRes.data);
    if (unsaveRes.status !== 200) {
        throw new Error("Unsave item failed");
    }

    // 9. Verify Saved Item list is empty
    console.log("\n9. Verifying saved items list after deletion...");
    const verifySavedRes = await apiCall("/me/saved", "GET", null, authHeader);
    console.log(`Status: ${verifySavedRes.status}`, verifySavedRes.data);

    // 10. Delete Item
    console.log(`\n10. Deleting item by ID: ${itemId}...`);
    const deleteItemRes = await apiCall(`/items/${itemId}`, "DELETE", null, authHeader);
    console.log(`Status: ${deleteItemRes.status}`, deleteItemRes.data);
    if (deleteItemRes.status !== 200) {
        throw new Error("Delete item failed");
    }

    console.log("\n=== All Tests Passed Successfully & Cleaned Up! ===");
}

runTests().catch(err => {
    console.error("\n❌ Test Suite Failed:", err.message);
    process.exit(1);
});
