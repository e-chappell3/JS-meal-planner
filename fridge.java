import java.util.ArrayList;

public class Fridge{
    ArrayList<Ingredient> ingredients = new ArrayList<Ingredient>();
    ArrayList<Recipe> recipes = new ArrayList<Recipe>();


    public Fridge(){
        loadFridge();
    }

    public void loadFridge(){
        // load ingredient objects + recipe objects from storage into lists
    }

    public void changeOwned(){
        // change ownership of ingredient if tick box changed
    }

    public ArrayList<Recipe> getRecipes(){
        // prompt available recipes
        // or most available recipes (requiring least ingredients) w/ added cost + ingredients needed
        // sort by reqCount ascending order!
    }

    public void saveFridge(){
        // save current objects/lists
    }
}