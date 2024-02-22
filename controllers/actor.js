import { isValidObjectId } from 'mongoose';
import Actor from '../schema/actor.js';
import cloudinary from '../services/cloudinaryService.js';

export const createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  try {
    const actor = new Actor({ name, about, gender });
    if (file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          aspect_ratio: '5:6',
          gravity: 'face',
          height: 150,
          zoom: '0.75',
          crop: 'thumb',
        }
      );
      actor.avatar = { url: secure_url, public_id };
    }
    await actor.save();

    res.status(200).json({ msg: 'success', data: actor });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

export const updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  try {
    if (!isValidObjectId(actorId)) {
      return res.status(400).json({ msg: 'not valid object id' });
    }
    const actor = await Actor.findById(actorId);

    if (actor.length === 0)
      return res.status(400).json({ msg: 'NO ACTOR FOund' });

    const public_id = actor.avatar?.public_id;
    //deteing the preStored avatar
    if (public_id && file) {
      const { result } = await cloudinary.uploader.destroy(public_id);
      if (result !== 'ok')
        return res.status(400).json({ msg: 'image is not deleted!' });
    }

    //uploading new photo
    if (file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          aspect_ratio: '5:6',
          gravity: 'face',
          height: 150,
          zoom: '0.75',
          crop: 'thumb',
        }
      );
      actor.avatar = { url: secure_url, public_id };
    }
    actor.name = name;
    actor.about = about;
    actor.gender = gender;

    await actor.save();

    return res.status(202).json({ msg: 'actor updated', data: actor });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'some error occurd' });
  }
};

export const deleteActor = async (req, res) => {
  const { actorId } = req.params;
  if (!isValidObjectId(actorId))
    return res.status(400).json({ msg: 'not valid object id' });
  const actor = await Actor.findById(actorId);

  const { public_id } = actor.avatar?.public_id;

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== 'ok') return res.status(400).json({ msg: 'not deleted' });
  }
  await Actor.findByIdAndDelete(actorId);
  return res.status(400).json({ msg: 'actor deleted sussefully' });
};

// application of token is not implemeted yet . once ive done it ill add this feachture so that
export const searchActor = async (req, res) => {
  const { query } = req;
  console.log(query);
  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  res.status(200).json({ msg: ' success', data: result });
};
// .find({$regx:{}})

export const latestUploads = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: '-1' }).limit(10);
  res.status(200).json({ msg: 'sucess', data: result });
};
export const getSingleActor = async (req, res) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    try {
      const actor = await Actor.findById(id);

      if (actor.length === 0) {
        return res.status(400).json({ msg: 'actor not found' });
      }

      res.status(200).json({ msg: 'user found', data: actor });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: error });
    }
  } else {
    return res.status(400).json({ msg: 'invalid Object ID' });
  }
};

export const getLatestActors = async (req, res) => {
  const { limit, pageNo } = req.query;

  try {
    const actors = await Actor.find()
    .sort({ createdAt: -1 })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit));

    res.status(200).json({msg:'success', data:actors})
    
  } catch (error) {
    console.log(error);
    res.status(400).json({msg:error})
  }
};
