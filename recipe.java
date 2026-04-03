import java.util.ArrayList;

public class Recipe{
    ArrayList<Ingredient> ingredients = new ArrayList<Ingredient>();
    float totalCost;
    float reqCost;
    Boolean canMake;
    ArrayList<Ingredient> required = new ArrayList<Ingredient>();

    public Recipe(Ingredient[] in){
        totalCost = 0;
        for (int i = 0; i < in.length; i++){
            ingredients.add(in[i]);
            totalCost += in[i].getPrice();
        }

        setMake();
        setReq();
    }

    public float getTotCost(){
        return totalCost;
    }

    public void setReqCost(){
        reqCost = 0;
        for (int i = 0; i < required.size; i++){
            reqCost += required.get(i).getPrice();
        }
    }

    public float getReqCost(){
        return reqCost;
    }

    public ArrayList<Ingredient> getReq(){
        return required;
    }

    public int getReqCount(){
        return required.size();
    }
    
    public Boolean getMake(){
        return canMake;
    }

    public void setMake(){
        for (int i = 0; i < ingredients.size(); i++){
            Ingredient curr = ingredients.get(i)
            if (curr.getOwned() == false){
                if (canMake != false){
                    canMake = false;
                }
                required.add(curr);
            }
            else if (required.contains(curr)){
                required.remove(curr);
            }
        }
    }
}