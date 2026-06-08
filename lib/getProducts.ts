import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getProducts() {
    try {
        const querySnapshot = await getDocs(
            collection(db, "pickups")
        );

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("FIRESTORE ERROR:", error);
        return [];
    }
}