public class Ingredient{
    protected String name;
    protected float price;
    protected Boolean isOwned;

    public Ingredient(String n, float p, Boolean o){
        name = n;
        price = p;
        isOwned = o;
    }

    public float getPrice(){
        return price;
    }

    public void setPrice(float p){
        price = p;
    }

    public Boolean getOwned(){
        return isOwned;
    }

    public void setOwned(Boolean o){
        isOwned = o;
    }
}