import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class RequiredConsumer implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _notifyOutputChanged : () => void;	
	private _targetValue : string | null = null;
	private _targetValueInternal : string |null = null;
	private _isValid : boolean = true;
	private _validInput : HTMLButtonElement;
	private _invalidInput : HTMLButtonElement;
	private _label : HTMLSpanElement;
	private _targetProperty : ComponentFramework.PropertyTypes.StringProperty;

	constructor()
	{

	}

	private renderValue(){
		this._label.textContent = `reported value: ${this._targetValue} (internal: ${this._targetValueInternal})` ;
		this._label.style.backgroundColor = this._targetValueInternal === null ? "green" : "red";	
		this._label.style.color = "white";	
	}

	private setValue(val : string){
		const newIsValid = (val === "VALID");
		
		if(this._isValid!==newIsValid){
			const fieldName = this._targetProperty.attributes?.LogicalName;
			const newMessage = {
				messageName: "ORBIS.FormGateway",
				fieldName,
				isValid : newIsValid, 
				errorMessage : newIsValid===false ? `The value for ${fieldName} not valid` : ""
			};
			console.log(`sending message ${0}`, newMessage );
			window.postMessage(newMessage, window.origin);
		}
		this._isValid = newIsValid;		
		if(this._isValid===true){
			this._targetValue = val;
			this._targetValueInternal = null;
		}
		else{
			this._targetValueInternal = val;
		}
		this.renderValue();
		this._notifyOutputChanged();
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._notifyOutputChanged = notifyOutputChanged;		
		this._targetProperty = context.parameters.targetProperty;

		this._targetValue = context.parameters.targetProperty.raw;
		
		this._label = document.createElement("span");	
		this._label.style.fontWeight="bold";
		this._label.style.marginRight="10px";
		container.appendChild(this._label);



		this._validInput = document.createElement("button");
		this._validInput.textContent = "set on VALID";
		this._validInput.addEventListener("click", () => this.setValue("VALID"));
		
		container.appendChild(this._validInput);
		
		this._invalidInput = document.createElement("button");
		this._invalidInput.innerHTML = "set on INVALID";
		this._invalidInput.addEventListener("click", () => this.setValue("INVALID"));
		
		container.appendChild(this._invalidInput);
		
		this.renderValue()
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if(this._targetValueInternal=== null){ //if internal value is not null, the internal edit mode is activated, don't accept external value
			this._targetValue = context.parameters.targetProperty.raw;
		}
		this.renderValue();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		if(this._isValid===true){
			return {
				targetProperty : this._targetValue || undefined
			};
		}
		else
		{
			return {};
		}
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{		
	}
}